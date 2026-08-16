'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import {
	type Article,
	type ArticleStatus,
	deleteArticles,
	duplicateArticle,
	listAllArticleIds,
	updateArticlesStatus,
} from 'lib/articles'
import { getFormattedDate } from 'lib/utils'

import {
	Badge,
	Button,
	PreviewCard,
	Separator,
	Tabs,
	useTabState,
} from 'ui/blocks'
import { Checkbox } from 'ui/forms'
import { DropdownMenu, Tooltip } from 'ui/floating'

import {
	Icon28ArchiveOutline,
	Icon28Cancel,
	Icon28ChevronDownOutline,
	Icon28CopyOutline,
	Icon28DeleteOutline,
	Icon28DoneOutline,
	Icon28EditOutline,
	Icon28DocumentPlusOutline,
	Icon28GlobeOutline,
	Icon28HandPointUpOutline,
	Icon28MoreHorizontal,
	Icon28SendOutline,
	Icon28SortOutline,
	Icon28UnarchiveOutline,
	Icon28UsersOutline,
	Icon28ViewOutline,
	Icon28ChainOutline,
} from '@vkontakte/icons'

const STATUS_TABS = ['all', 'published', 'draft', 'archived'] as const

type ArticlesManagerProps = {
	articles: Article[]
}

export function ArticlesManager({ articles }: ArticlesManagerProps) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()
	const { tabState, handleTabSelect } = useTabState(0)
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [allExistingSelected, setAllExistingSelected] = useState(false)

	const statusFilter = STATUS_TABS[tabState] ?? 'all'

	const pageArticles = useMemo(() => {
		if (statusFilter === 'all') return articles
		return articles.filter(article => article.status === statusFilter)
	}, [articles, statusFilter])

	const pageIds = pageArticles.map(article => article.id)
	const pageSelected =
		pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id))
	const somePageSelected =
		pageIds.some(id => selectedIds.includes(id)) && !pageSelected

	function togglePage() {
		setAllExistingSelected(false)
		setSelectedIds(prev => {
			if (pageSelected) {
				return prev.filter(id => !pageIds.includes(id))
			}
			return [...new Set([...prev, ...pageIds])]
		})
	}

	function toggleOne(id: string) {
		setAllExistingSelected(false)
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
		)
	}

	function selectAllExisting() {
		startTransition(async () => {
			try {
				const ids = await listAllArticleIds()
				setSelectedIds(ids)
				setAllExistingSelected(true)
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : 'Не удалось выбрать все',
				)
			}
		})
	}

	function runBulk(
		action: () => Promise<{ ok: boolean; error?: string }>,
		success: string,
	) {
		startTransition(async () => {
			const result = await action()
			if (!result.ok) {
				toast.error(result.error ?? 'Ошибка')
				return
			}
			toast.success(success)
			setSelectedIds([])
			setAllExistingSelected(false)
			router.refresh()
		})
	}

	function onBulkStatus(status: ArticleStatus) {
		runBulk(
			() => updateArticlesStatus(selectedIds, status),
			`Обновлено: ${selectedIds.length}`,
		)
	}

	function onBulkDelete() {
		runBulk(() => deleteArticles(selectedIds), `Удалено: ${selectedIds.length}`)
	}

	function onDuplicate(id: string) {
		startTransition(async () => {
			const result = await duplicateArticle(id)
			if (!result.ok) {
				toast.error(result.error ?? 'Ошибка')
				return
			}

			toast.success('Статья скопирована')
			if (result.article) {
				router.push(`/admin/articles/${result.article.id}`)
				return
			}
			router.refresh()
		})
	}

	return (
		<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
			<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
				<div className='flex flex-1 flex-col gap-3'>
					<h1 className='text-3xl font-medium font-condensed tracking-tight'>
						Articles Manager
					</h1>
				</div>

				<div className='flex self-start gap-2'>
					<Tooltip text='Create new article'>
						<Button
							to='/admin/articles/new'
							mode='secondary'
							appearance='neutral'
							prefix={<Icon28DocumentPlusOutline width={18} height={18} />}
							iconOnly
						/>
					</Tooltip>
				</div>
			</div>

			<div className='flex flex-col'>
				<Tabs
					className='px-surface border-none'
					initialIndex={tabState}
					onTabSelect={index => {
						handleTabSelect(index)
						setSelectedIds([])
						setAllExistingSelected(false)
					}}
				>
					<Tabs.Item>All</Tabs.Item>
					<Tabs.Item>Published</Tabs.Item>
					<Tabs.Item>Drafts</Tabs.Item>
					<Tabs.Item>Archived</Tabs.Item>
				</Tabs>

				<div className='flex flex-col bg-background border border-separator rounded-surface overflow-hidden'>
					<div className='flex flex-col bg-surface'>
						<AnimatePresence initial={false}>
							{selectedIds.length > 0 && (
								<motion.div
									key='articles-bulk-toolbar'
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{
										height: {
											type: 'tween',
											duration: 0.16,
											ease: 'easeInOut',
										},
										opacity: { duration: 0.16 },
									}}
									className='overflow-hidden'
								>
									<div className='flex flex-col p-2 pb-0 gap-2'>
										<div className='group flex p-2 gap-2 rounded-md bg-surface-secondary'>
											<Button
												onClick={selectAllExisting}
												type='button'
												size='sm'
												mode='ghost'
												appearance='neutral'
												disabled={pending}
											>
												{allExistingSelected ? 'All selected' : 'Select all'}
											</Button>

											<Separator orientation='vertical' />

											<DropdownMenu align='center'>
												<DropdownMenu.Trigger>
													<Button
														type='button'
														size='sm'
														mode='ghost'
														appearance='neutral'
														disabled={pending}
														prefix={
															<Icon28ViewOutline width={16} height={16} />
														}
														suffix={
															<Icon28ChevronDownOutline
																width={16}
																height={16}
															/>
														}
													>
														Visibility
													</Button>
												</DropdownMenu.Trigger>

												<DropdownMenu.Content className='w-40'>
													<DropdownMenu.Box>
														{statusFilter !== 'published' &&
															statusFilter !== 'archived' && (
																<DropdownMenu.Item
																	aria-label='Publish articles'
																	onClick={() => onBulkStatus('published')}
																	prefix={
																		<Icon28SendOutline width={18} height={18} />
																	}
																>
																	Publish
																</DropdownMenu.Item>
															)}

														{statusFilter !== 'archived' ? (
															<DropdownMenu.Item
																aria-label='Archive article'
																prefix={
																	<Icon28ArchiveOutline
																		width={18}
																		height={18}
																	/>
																}
																onClick={() =>
																	runBulk(
																		() =>
																			updateArticlesStatus(
																				selectedIds,
																				'archived',
																			),
																		`Articles archived: ${selectedIds.length}`,
																	)
																}
															>
																Archive
															</DropdownMenu.Item>
														) : (
															<DropdownMenu.Item
																aria-label='Unarchive article'
																prefix={
																	<Icon28UnarchiveOutline
																		width={18}
																		height={18}
																	/>
																}
																onClick={() =>
																	runBulk(
																		() =>
																			updateArticlesStatus(
																				selectedIds,
																				'published',
																			),
																		`Articles restored: ${selectedIds.length}`,
																	)
																}
															>
																Unarchive
															</DropdownMenu.Item>
														)}
													</DropdownMenu.Box>
												</DropdownMenu.Content>
											</DropdownMenu>

											<Button
												type='button'
												size='sm'
												mode='ghost'
												appearance='danger'
												disabled={pending}
												prefix={<Icon28DeleteOutline width={16} height={16} />}
												onClick={onBulkDelete}
											>
												Delete
											</Button>

											<span className='flex-1' />

											<Button
												onClick={() => setSelectedIds([])}
												type='button'
												size='sm'
												mode='ghost'
												appearance='neutral'
												prefix={<Icon28Cancel width={16} height={16} />}
											/>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						<div className='h-12 flex items-center px-surface gap-surface'>
							<Checkbox
								aria-label='Select page articles'
								checked={pageSelected}
								indeterminate={somePageSelected}
								onChange={togglePage}
							/>

							<span className='flex-1 text-foreground-secondary text-sm truncate'>
								{selectedIds.length > 0
									? `${selectedIds.length} selected`
									: `${pageArticles.length} articles`}
							</span>

							<DropdownMenu>
								<DropdownMenu.Trigger>
									<Button
										type='button'
										size='sm'
										mode='secondary'
										appearance='neutral'
										prefix={<Icon28SortOutline width={16} height={16} />}
									>
										Sort
									</Button>
								</DropdownMenu.Trigger>

								<DropdownMenu.Content className='w-40'>
									<DropdownMenu.Box>
										<DropdownMenu.Item
											aria-label='By title'
											mode={!true ? 'ghost' : 'secondary'}
											suffix={
												true && <Icon28DoneOutline width={18} height={18} />
											}
										>
											By title
										</DropdownMenu.Item>

										<DropdownMenu.Item
											aria-label='By views'
											mode={true ? 'ghost' : 'secondary'}
											suffix={
												!true && <Icon28DoneOutline width={18} height={18} />
											}
										>
											By views
										</DropdownMenu.Item>

										<DropdownMenu.Item
											aria-label='By date'
											mode={true ? 'ghost' : 'secondary'}
											suffix={
												!true && <Icon28DoneOutline width={18} height={18} />
											}
										>
											By date
										</DropdownMenu.Item>
									</DropdownMenu.Box>
								</DropdownMenu.Content>
							</DropdownMenu>
						</div>
					</div>

					<Separator />

					{pageArticles.length === 0 ? (
						<div className='min-h-40 flex items-center justify-center p-surface'>
							<p className='text-center text-sm text-foreground-secondary'>
								No articles in this status
							</p>
						</div>
					) : (
						pageArticles.map(article => (
							<div
								key={article.id}
								className={twMerge(
									'group flex flex-col not-last:border-b border-separator hover:bg-surface transition-colors',
									selectedIds.includes(article.id) && 'bg-surface',
								)}
							>
								<div className='flex p-surface gap-surface'>
									<Checkbox
										className='my-auto'
										aria-label={`Select ${article.title}`}
										checked={selectedIds.includes(article.id)}
										onChange={() => toggleOne(article.id)}
									/>

									<PreviewCard
										className='w-28 h-fit'
										ratio='3:2'
										src={article.cover_url ?? undefined}
										alt={article.title}
										radius='sm'
										sizes='(max-width: 1240px) 100vw, 1240px'
										inner={
											<span className='z-1 absolute inset-0 w-full h-full'>
												{article.status === 'draft' && (
													<span className='size-full flex items-center justify-center bg-surface/60'>
														<Badge
															appearance='neutral'
															prefix={
																<Icon28EditOutline width={16} height={16} />
															}
														/>
													</span>
												)}

												{article.status === 'archived' && (
													<span className='size-full flex items-center justify-center bg-surface/60'>
														<Badge
															appearance='neutral'
															prefix={
																<Icon28ArchiveOutline width={16} height={16} />
															}
														/>
													</span>
												)}
											</span>
										}
									>
										<span className='z-1 absolute inset-0 w-full h-full'>
											{article.company && (
												<div className='z-1 absolute -bottom-2 right-2 size-9 flex items-center justify-center bg-surface border border-separator rounded-full overflow-hidden'>
													<Image
														className='w-full h-full object-cover'
														src={article.company.logo}
														alt={article.company.name}
														width={200}
														height={200}
													/>
												</div>
											)}
										</span>
									</PreviewCard>

									<div className='min-w-0 min-h-full flex-1 flex flex-col justify-center gap-2'>
										<Link
											href={`/admin/articles/${article.id}`}
											className='max-w-full w-fit text-xl font-medium font-condensed tracking-tight truncate hover:underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link rounded'
										>
											{article.title}
										</Link>

										<span className='flex flex-wrap gap-1'>
											<Badge
												size='md'
												mode='soft'
												appearance={
													article.views_24h > 0 ? 'success' : 'neutral'
												}
												prefix={
													article.type === 'article' ? (
														<Icon28ViewOutline width={14} height={14} />
													) : (
														<Icon28HandPointUpOutline width={14} height={14} />
													)
												}
												title='Views (last 24h delta)'
											>
												{article.views}
												{article.views_24h > 0 && ' +' + article.views_24h}
											</Badge>

											<Badge
												size='md'
												mode='soft'
												appearance={
													article.uniques_24h > 0 ? 'success' : 'neutral'
												}
												prefix={<Icon28UsersOutline width={14} height={14} />}
												title='Unique visitors (last 24h delta)'
											>
												{article.unique_visitors}
												{article.uniques_24h > 0 && ' +' + article.uniques_24h}
											</Badge>

											<Badge size='md' mode='soft' appearance='neutral'>
												{getFormattedDate(article.created_at).short}
											</Badge>

											<Badge
												className='capitalize'
												size='md'
												mode='soft'
												appearance='neutral'
											>
												{article.category}
											</Badge>

											{article.type === 'link' && (
												<Badge
													size='md'
													mode='soft'
													appearance='neutral'
													prefix={<Icon28ChainOutline width={14} height={14} />}
												>
													External
												</Badge>
											)}
										</span>
									</div>

									<div className='flex gap-2'>
										<DropdownMenu>
											<DropdownMenu.Trigger>
												<Button
													mode='ghost'
													appearance='neutral'
													prefix={
														<Icon28MoreHorizontal width={18} height={18} />
													}
													iconOnly
												/>
											</DropdownMenu.Trigger>

											<DropdownMenu.Content className='w-32'>
												<DropdownMenu.Box>
													{article.type === 'article' && article.slug && (
														<DropdownMenu.Item
															aria-label='Preview article'
															href={`/articles/${article.slug}`}
															target='_blank'
															prefix={
																<Icon28ViewOutline width={18} height={18} />
															}
														>
															Preview
														</DropdownMenu.Item>
													)}

													{article.type === 'link' && article.external_url && (
														<DropdownMenu.Item
															aria-label='Open link'
															href={article.external_url}
															target='_blank'
															prefix={
																<Icon28GlobeOutline width={18} height={18} />
															}
														>
															Open
														</DropdownMenu.Item>
													)}

													<DropdownMenu.Item
														aria-label='Duplicate article'
														prefix={
															<Icon28CopyOutline width={18} height={18} />
														}
														disabled={pending}
														onClick={() => onDuplicate(article.id)}
													>
														Duplicate
													</DropdownMenu.Item>

													<DropdownMenu.Item
														aria-label='Edit article'
														to={`/admin/articles/${article.id}`}
														prefix={
															<Icon28EditOutline width={18} height={18} />
														}
													>
														Edit
													</DropdownMenu.Item>
												</DropdownMenu.Box>

												<DropdownMenu.Box>
													{article.status !== 'archived' ? (
														<DropdownMenu.Item
															aria-label='Archive article'
															prefix={
																<Icon28ArchiveOutline width={18} height={18} />
															}
															onClick={() =>
																runBulk(
																	() =>
																		updateArticlesStatus(
																			[article.id],
																			'archived',
																		),
																	'Статья в архиве',
																)
															}
														>
															Archive
														</DropdownMenu.Item>
													) : (
														<DropdownMenu.Item
															aria-label='Unarchive article'
															prefix={
																<Icon28UnarchiveOutline
																	width={18}
																	height={18}
																/>
															}
															onClick={() =>
																runBulk(
																	() =>
																		updateArticlesStatus(
																			[article.id],
																			'published',
																		),
																	'Статья восстановлена',
																)
															}
														>
															Unarchive
														</DropdownMenu.Item>
													)}

													<DropdownMenu.Item
														aria-label='Delete article'
														appearance='danger'
														prefix={
															<Icon28DeleteOutline width={18} height={18} />
														}
														onClick={() =>
															runBulk(
																() => deleteArticles([article.id]),
																'Статья удалена',
															)
														}
													>
														Delete
													</DropdownMenu.Item>
												</DropdownMenu.Box>
											</DropdownMenu.Content>
										</DropdownMenu>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</section>
	)
}
