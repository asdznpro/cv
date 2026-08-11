'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { useClipboard } from '@siberiacancode/reactuse'

import {
	ARTICLE_CATEGORIES,
	ARTICLE_TAGS,
	createArticle,
	slugifyArticleTitle,
	updateArticle,
	type Article,
	type ArticleCategory,
	type ArticleInput,
	type ArticleRelatedMode,
	type ArticleStatus,
	type ArticleTag,
	type ArticleType,
} from 'lib/articles'
import type { Company } from 'lib/companies'

import { Badge, Button, Kbd, Separator, Tabs, useTabState } from 'ui/blocks'
import { FormItem } from 'ui/forms'
import { Tooltip } from 'ui/floating'
import { MarkdownPreview } from 'ui/markdown'
import { useOverlay } from 'ui/overlays'

import {
	Icon28AddOutline,
	Icon28ArrowLeftOutline,
	Icon28CancelOutline,
	Icon28DeleteOutline,
	Icon28DocumentTextOutline,
} from '@vkontakte/icons'

import { ChooseEntityDialog } from './ChooseEntityDialog'
import { DeleteArticleDialog } from './DeleteArticleDialog'
import { UploadCoverDialog } from './UploadCoverDialog'

type FormState = {
	title: string
	description: string
	content: string
	cover_url: string
	company_id: string
	type: ArticleType
	status: ArticleStatus
	slug: string
	external_url: string
	category: ArticleCategory
	tags: ArticleTag[]
	related_mode: ArticleRelatedMode
	related_article_ids: string[]
}

const STATUS_OPTIONS = [
	{ label: 'Posted', value: 'published' },
	{ label: 'Draft', value: 'draft' },
	{ label: 'Archived', value: 'archived' },
]

const LIVE_STATUS_OPTIONS = STATUS_OPTIONS.filter(
	option => option.value !== 'draft',
)

const TYPE_OPTIONS = [
	{ label: 'Article', value: 'article' },
	{ label: 'External link', value: 'link' },
]

const CATEGORY_OPTIONS = ARTICLE_CATEGORIES.map(value => ({
	label: value.charAt(0).toUpperCase() + value.slice(1),
	value,
}))

const TAG_OPTIONS = ARTICLE_TAGS.map(value => ({
	label: value,
	value,
}))

const RELATED_MODE_OPTIONS = [
	{ label: 'Auto', value: 'auto' },
	{ label: 'Manual', value: 'manual' },
]

const EMPTY_FORM: FormState = {
	title: '',
	description: '',
	content: '',
	cover_url: '',
	company_id: '',
	type: 'article',
	status: 'draft',
	slug: '',
	external_url: '',
	category: 'other',
	tags: [],
	related_mode: 'auto',
	related_article_ids: [],
}

function toFormState(article: Article): FormState {
	return {
		title: article.title,
		description: article.description,
		content: article.content,
		cover_url: article.cover_url ?? '',
		company_id: article.company_id ?? '',
		type: article.type,
		status: article.status,
		slug: article.slug ?? '',
		external_url: article.external_url ?? '',
		category: article.category,
		tags: article.tags,
		related_mode: article.related_mode,
		related_article_ids: article.related_article_ids,
	}
}

function toInput(form: FormState): ArticleInput {
	return {
		title: form.title,
		description: form.description,
		content: form.content,
		cover_url: form.cover_url || null,
		company_id: form.company_id || null,
		type: form.type,
		status: form.status,
		slug: form.type === 'article' ? form.slug : null,
		external_url: form.type === 'link' ? form.external_url : null,
		category: form.category,
		tags: form.tags,
		related_mode: form.related_mode,
		related_article_ids:
			form.related_mode === 'manual'
				? form.related_article_ids.filter(Boolean)
				: [],
	}
}

function getCursorPosition(value: string, selectionStart: number) {
	const textBefore = value.slice(0, Math.max(0, selectionStart))
	const lines = textBefore.split('\n')
	return {
		line: lines.length,
		column: (lines.at(-1)?.length ?? 0) + 1,
	}
}

type ArticleEditorManagerProps = {
	article: Article | null
	companies: Company[]
	articleOptions: Array<{ id: string; title: string }>
}

export function ArticleEditorManager({
	article,
	companies,
	articleOptions,
}: ArticleEditorManagerProps) {
	const router = useRouter()
	const { open, close } = useOverlay()
	const { copy } = useClipboard()
	const [pending, startTransition] = useTransition()
	const { tabState, handleTabSelect } = useTabState(0)

	const initial = useMemo(
		() => (article ? toFormState(article) : EMPTY_FORM),
		[article],
	)
	const [form, setForm] = useState<FormState>(initial)
	const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug))
	const [articleId, setArticleId] = useState(article?.id ?? null)
	const [relatedSlots, setRelatedSlots] = useState<
		Array<{ key: string; articleId: string }>
	>(() =>
		(article?.related_article_ids ?? []).map(id => ({
			key: id,
			articleId: id,
		})),
	)
	const [cursor, setCursor] = useState({ line: 1, column: 1 })

	const selectedCompany = companies.find(item => item.id === form.company_id)
	const relatedOptions = articleOptions
		.filter(item => item.id !== articleId)
		.map(item => ({ label: item.title, value: item.id }))

	const isDirty = useMemo(() => {
		if (JSON.stringify(form) !== JSON.stringify(initial)) return true

		const initialRelated = article?.related_article_ids ?? []
		const currentRelated = relatedSlots.map(slot => slot.articleId)
		if (currentRelated.length !== initialRelated.length) return true
		return currentRelated.some((id, index) => id !== initialRelated[index])
	}, [article?.related_article_ids, form, initial, relatedSlots])

	const statusOptions =
		article?.status === 'published' || article?.status === 'archived'
			? LIVE_STATUS_OPTIONS
			: STATUS_OPTIONS

	function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	function onTitleChange(value: string) {
		setForm(prev => ({
			...prev,
			title: value,
			slug:
				prev.type === 'article' && !slugTouched
					? slugifyArticleTitle(value)
					: prev.slug,
		}))
	}

	function discard() {
		setForm(initial)
		setSlugTouched(Boolean(article?.slug))
		setRelatedSlots(
			(article?.related_article_ids ?? []).map(id => ({
				key: id,
				articleId: id,
			})),
		)
		toast.message('Changes discarded')
	}

	function save(nextStatus?: ArticleStatus) {
		const payload = toInput({
			...form,
			status: nextStatus ?? form.status,
			related_article_ids: relatedSlots.map(slot => slot.articleId),
		})

		startTransition(async () => {
			const result = articleId
				? await updateArticle(articleId, payload)
				: await createArticle(payload)

			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success(
				nextStatus === 'published'
					? 'Published'
					: articleId
						? 'Changes saved'
						: 'Article created',
			)

			if (!articleId && result.article) {
				setArticleId(result.article.id)
				router.replace(`/admin/articles/${result.article.id}`)
				return
			}

			router.refresh()
		})
	}

	function syncCursor(textarea: HTMLTextAreaElement) {
		setCursor(getCursorPosition(textarea.value, textarea.selectionStart))
	}

	function openUploadCover() {
		open(
			<UploadCoverDialog
				articleId={articleId ?? undefined}
				onCancel={close}
				onSave={({ url }) => {
					if (url) setField('cover_url', url)
					close()
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	function openChooseEntity() {
		open(
			<ChooseEntityDialog
				companies={companies}
				value={form.company_id || null}
				onCancel={close}
				onSave={companyId => {
					setField('company_id', companyId ?? '')
					close()
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	function openDelete() {
		if (!article) return
		open(
			<DeleteArticleDialog
				article={article}
				onCancel={close}
				onSuccess={() => {
					close()
					router.push('/admin/articles')
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	function addRelatedSlot() {
		if (relatedSlots.length >= 3) return
		setRelatedSlots(prev => [
			...prev,
			{ key: crypto.randomUUID(), articleId: '' },
		])
	}

	function setRelatedAt(key: string, value: string) {
		setRelatedSlots(prev =>
			prev.map(slot =>
				slot.key === key ? { ...slot, articleId: value } : slot,
			),
		)
	}

	function removeRelatedAt(key: string) {
		setRelatedSlots(prev => prev.filter(slot => slot.key !== key))
	}

	const contentStats = {
		chars: form.content.length,
		lines: form.content.split('\n').length,
	}

	return (
		<>
			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							General
						</h2>
					</div>
				</div>

				{article && (
					<div className='flex flex-col bg-surface border border-separator rounded-surface'>
						<div className='flex flex-wrap p-surface gap-surface'>
							<div className='flex flex-1 flex-col gap-3'>
								<h3 className='text-xl font-medium font-condensed tracking-tight'>
									Status
								</h3>
								<p className='text-sm text-foreground-secondary @xl:text-balance'>
									Control the status of the article
								</p>
							</div>

							<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
								<FormItem id='article-status'>
									<FormItem.Select
										mode='outline'
										size='md'
										options={statusOptions}
										value={form.status}
										onValueChange={value =>
											setField('status', value as ArticleStatus)
										}
										placeholder='Select status'
									/>
								</FormItem>
							</div>
						</div>
					</div>
				)}

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Cover
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Hero image for the article preview. Optionally attach an entity
								badge, like a company logo.
							</p>
						</div>

						<div className='w-full @xl:w-2/5'>
							<div className='z-0 relative flex'>
								<button
									type='button'
									onClick={openUploadCover}
									className='aspect-4/1 w-full flex items-center justify-center text-foreground-secondary bg-background hover:bg-surface-secondary border border-dashed border-separator rounded-md overflow-hidden cursor-pointer transition-colors focus-ring-base focus-ring-visible'
								>
									{form.cover_url ? (
										<Image
											src={form.cover_url}
											alt='Cover'
											width={80}
											height={80}
											unoptimized
											className='size-full object-cover'
										/>
									) : (
										<Icon28AddOutline width={16} height={16} />
									)}
								</button>

								<button
									onClick={openChooseEntity}
									type='button'
									className='z-1 absolute -bottom-2 right-4 size-12 flex items-center justify-center text-foreground-secondary bg-background hover:bg-surface-secondary border border-dashed border-separator rounded-full overflow-hidden cursor-pointer transition-colors focus-ring-base focus-ring-visible'
								>
									{selectedCompany ? (
										<Image
											src={selectedCompany.logo}
											alt={selectedCompany.name}
											width={48}
											height={48}
											className='size-full object-cover'
										/>
									) : (
										<Icon28AddOutline width={16} height={16} />
									)}
								</button>
							</div>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Details
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Headline and short summary used in lists, cards, and the article
								header
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='article-title'>
								<FormItem.Input
									mode='outline'
									size='md'
									type='text'
									placeholder='Title'
									value={form.title}
									onChange={event =>
										onTitleChange((event.target as HTMLInputElement).value)
									}
								/>
							</FormItem>

							<FormItem id='article-description'>
								<FormItem.Textarea
									mode='outline'
									size='md'
									placeholder='Description'
									resize='none'
									rows={3}
									value={form.description}
									onChange={event =>
										setField(
											'description',
											(event.target as HTMLTextAreaElement).value,
										)
									}
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Classification
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Article uses a slug. External link uses a URL.
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='article-type'>
								<FormItem.Select
									mode='outline'
									size='md'
									options={TYPE_OPTIONS}
									value={form.type}
									onValueChange={value => {
										const type = value as ArticleType
										setForm(prev => ({
											...prev,
											type,
											slug:
												type === 'article'
													? prev.slug || slugifyArticleTitle(prev.title)
													: '',
											external_url: type === 'link' ? prev.external_url : '',
										}))
									}}
									placeholder='Select type'
								/>
							</FormItem>

							{form.type === 'article' ? (
								<FormItem id='article-slug'>
									<FormItem.Input
										mode='outline'
										size='md'
										type='text'
										placeholder='Slug'
										value={form.slug}
										onChange={event => {
											setSlugTouched(true)
											setField('slug', (event.target as HTMLInputElement).value)
										}}
									/>
								</FormItem>
							) : (
								<FormItem id='article-link'>
									<FormItem.Input
										mode='outline'
										size='md'
										type='url'
										placeholder='https://…'
										value={form.external_url}
										onChange={event =>
											setField(
												'external_url',
												(event.target as HTMLInputElement).value,
											)
										}
									/>
								</FormItem>
							)}
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Taxonomies
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Add taxonomies to the article for better search and filtering
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='article-category'>
								<FormItem.Select
									mode='outline'
									size='md'
									options={CATEGORY_OPTIONS}
									value={form.category}
									onValueChange={value =>
										setField('category', value as ArticleCategory)
									}
									placeholder='Select category'
								/>
							</FormItem>

							<FormItem id='article-tags'>
								<FormItem.Autocomplete
									mode='outline'
									size='md'
									options={TAG_OPTIONS}
									value={form.tags}
									onValueChange={value =>
										setField('tags', value as ArticleTag[])
									}
									placeholder='Add tags'
								/>
							</FormItem>
						</div>
					</div>
				</div>

				{form.type === 'article' && (
					<>
						<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
							<div className='flex flex-col gap-3'>
								<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
									Content
								</h2>
							</div>
						</div>

						<div className='flex flex-col border border-separator rounded-surface overflow-hidden'>
							<div className='flex flex-col bg-surface'>
								<div className='h-12 flex items-center px-surface gap-surface'>
									<Tabs
										className='border-none'
										initialIndex={tabState}
										onTabSelect={handleTabSelect}
									>
										<Tabs.Item>Edit</Tabs.Item>
										<Tabs.Item>Preview</Tabs.Item>
									</Tabs>

									<Button
										type='button'
										size='sm'
										mode='soft'
										appearance='neutral'
										prefix={
											<Icon28DocumentTextOutline width={16} height={16} />
										}
										onClick={() => {
											void copy(form.content)
											toast.success('Markdown copied')
										}}
									>
										Copy Markdown
									</Button>
								</div>
							</div>

							<Separator />

							{tabState === 0 ? (
								<div className='flex'>
									<textarea
										className='w-full p-surface resize-none appearance-none outline-none text-xs font-mono placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary'
										placeholder='Write your article here...'
										rows={20}
										value={form.content}
										onChange={event => {
											setField('content', event.currentTarget.value)
											syncCursor(event.currentTarget)
										}}
										onClick={event => syncCursor(event.currentTarget)}
										onKeyUp={event => syncCursor(event.currentTarget)}
										onSelect={event => syncCursor(event.currentTarget)}
									/>
								</div>
							) : (
								<div className='p-surface max-h-88 min-h-88 overflow-y-auto overflow-x-clip'>
									<MarkdownPreview>{form.content}</MarkdownPreview>
								</div>
							)}

							<Separator />

							<div className='h-12 flex items-center p-surface gap-surface bg-surface'>
								{tabState === 0 && (
									<>
										<span className='text-xs text-foreground-secondary'>
											Line {cursor.line}, Column {cursor.column}
										</span>

										<Separator orientation='vertical' />
									</>
								)}

								<span className='text-xs text-foreground-secondary'>
									{contentStats.lines} lines
								</span>

								<Separator orientation='vertical' />

								<span className='text-xs text-foreground-secondary'>
									{contentStats.chars.toLocaleString('ru-RU')} characters
								</span>

								<span className='flex-1' />

								<span className='flex items-center gap-2'>
									<Kbd size='sm' keys={['Ctrl', 'Enter']} />
									<span className='text-xs text-foreground-secondary'>
										switch mode
									</span>
								</span>
							</div>
						</div>
					</>
				)}

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Related articles
						</h2>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Related articles
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Select related articles to display in the sidebar or let the
								system generate them automatically
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='article-related-mode'>
								<FormItem.Select
									mode='outline'
									size='md'
									options={RELATED_MODE_OPTIONS}
									value={form.related_mode}
									onValueChange={value =>
										setField('related_mode', value as ArticleRelatedMode)
									}
									placeholder='Select mode'
								/>
							</FormItem>

							{form.related_mode === 'manual' && (
								<>
									{relatedSlots.map(slot => (
										<div key={slot.key} className='flex items-center gap-2'>
											<FormItem
												id={`article-related-${slot.key}`}
												className='flex-1'
											>
												<FormItem.Combobox
													mode='outline'
													size='md'
													options={relatedOptions}
													value={slot.articleId}
													onValueChange={value => setRelatedAt(slot.key, value)}
													placeholder='Select article'
												/>
											</FormItem>

											<Badge
												size='sm'
												mode='secondary'
												appearance='neutral'
												prefix={<Icon28CancelOutline width={12} height={12} />}
												onClick={() => removeRelatedAt(slot.key)}
											/>
										</div>
									))}

									<Button
										className='w-full border-dashed'
										mode='outline'
										appearance='neutral'
										prefix={<Icon28AddOutline width={18} height={18} />}
										suffix={<span>{relatedSlots.length}/3</span>}
										align='spread'
										disabled={relatedSlots.length >= 3}
										onClick={addRelatedSlot}
									>
										Add more
									</Button>
								</>
							)}
						</div>
					</div>
				</div>

				{articleId && (
					<>
						<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
							<div className='flex flex-col gap-3'>
								<h2 className='flex-1 text-danger text-3xl font-medium font-condensed tracking-tight'>
									Danger zone
								</h2>
							</div>
						</div>

						<div className='flex flex-col bg-surface border border-separator rounded-surface outline-2 outline-offset-4 outline-danger'>
							<div className='flex flex-wrap p-surface gap-surface'>
								<div className='flex flex-1 flex-col gap-3'>
									<h3 className='text-xl font-medium font-condensed tracking-tight'>
										Delete article
									</h3>
									<p className='text-sm text-foreground-secondary @xl:text-balance'>
										Permanently delete the article and all associated data
									</p>
								</div>

								<div className='w-full @xl:w-fit flex flex-col gap-2'>
									<Button
										className='w-full'
										mode='secondary'
										appearance='danger'
										prefix={<Icon28DeleteOutline width={18} height={18} />}
										onClick={openDelete}
										disabled={pending}
									>
										Delete article
									</Button>
								</div>
							</div>
						</div>
					</>
				)}
			</section>

			<section className='sticky bottom-app mx-auto max-w-md w-full flex flex-col px-app gap-app'>
				<div className='flex flex-col bg-background border border-separator rounded-full overflow-hidden'>
					<div className='flex items-center p-2 gap-2'>
						<Tooltip text='Back to articles'>
							<Button
								to='/admin/articles'
								mode='ghost'
								appearance='neutral'
								radius='rounded'
								prefix={<Icon28ArrowLeftOutline width={18} height={18} />}
								iconOnly
							/>
						</Tooltip>

						<AnimatePresence initial={false}>
							{isDirty && (
								<motion.div
									key='discard-changes'
									initial={{ transform: 'translateX(-12px)', opacity: 0 }}
									animate={{ transform: 'translateX(0)', opacity: 1 }}
									exit={{ transform: 'translateX(-12px)', opacity: 0 }}
									transition={{
										transform: {
											type: 'tween',
											duration: 0.16,
											ease: 'easeInOut',
										},
										opacity: { duration: 0.16 },
									}}
									className='overflow-hidden'
								>
									<Button
										type='button'
										mode='secondary'
										appearance='neutral'
										radius='rounded'
										onClick={discard}
										disabled={pending}
									>
										Discard changes
									</Button>
								</motion.div>
							)}
						</AnimatePresence>

						<span className='flex-1' />

						{article ? (
							<Button
								type='button'
								radius='rounded'
								onClick={() => save()}
								disabled={pending || !isDirty}
							>
								Save changes
							</Button>
						) : (
							<>
								<Button
									type='button'
									mode='ghost'
									appearance='neutral'
									radius='rounded'
									onClick={() => save('draft')}
									disabled={pending}
								>
									Save draft
								</Button>

								<Button
									type='button'
									radius='rounded'
									onClick={() => save('published')}
									disabled={pending}
								>
									Publish
								</Button>
							</>
						)}
					</div>
				</div>
			</section>
		</>
	)
}
