'use client'

import { useEffect, useState } from 'react'

import { Badge, Button, Kbd, Separator, Tabs, useTabState } from 'ui/blocks'
import { FormItem } from 'ui/forms'
import { Tooltip } from 'ui/floating'
import { useOverlay } from 'ui/overlays'

import {
	Icon28AddOutline,
	Icon28ArchiveOutline,
	Icon28ArrowLeftOutline,
	Icon28CancelOutline,
	Icon28DeleteOutline,
	Icon28DocumentTextOutline,
} from '@vkontakte/icons'

import { ChooseEntityDialog } from './ChooseEntityDialog'
import { UploadCoverDialog } from './UploadCoverDialog'

export default function Article() {
	const { tabState, handleTabSelect } = useTabState(0)
	const { open, close } = useOverlay()

	const [coverFile, setCoverFile] = useState<File | null>(null)
	const [coverPreview, setCoverPreview] = useState<string | null>(null)

	useEffect(() => {
		if (!coverFile) {
			setCoverPreview(null)
			return
		}

		const url = URL.createObjectURL(coverFile)
		setCoverPreview(url)
		return () => URL.revokeObjectURL(url)
	}, [coverFile])

	const openUploadCoverDialog = () => {
		open(
			<UploadCoverDialog
				onCancel={close}
				onSave={file => {
					setCoverFile(file)
					close()
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	const openChooseEntityDialog = () => {
		open(
			<ChooseEntityDialog
				onCancel={close}
				onSave={file => {
					setCoverFile(file)
					close()
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							General
						</h2>
					</div>
				</div>

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
							<FormItem id='article-category'>
								<FormItem.Select
									mode='outline'
									size='md'
									options={[
										{ label: 'Posted', value: 'posted' },
										{ label: 'Draft', value: 'draft' },
										{ label: 'Archived', value: 'archived' },
									]}
									value='posted'
									placeholder='Select visibility'
								/>
							</FormItem>
						</div>
					</div>
				</div>

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
									onClick={openUploadCoverDialog}
									className='aspect-4/1 w-full flex items-center justify-center text-foreground-secondary bg-background hover:bg-surface-secondary border border-dashed border-separator rounded-md overflow-hidden cursor-pointer transition-colors focus-ring-base focus-ring-visible'
								>
									{coverPreview ? (
										<img
											src={coverPreview}
											alt={coverFile?.name ?? 'Cover'}
											className='size-full object-cover'
										/>
									) : (
										<Icon28AddOutline width={16} height={16} />
									)}
								</button>

								<button
									onClick={openChooseEntityDialog}
									type='button'
									className='z-1 absolute -bottom-2 right-4 size-12 flex items-center justify-center text-foreground-secondary bg-background hover:bg-surface-secondary border border-dashed border-separator rounded-full overflow-hidden cursor-pointer transition-colors focus-ring-base focus-ring-visible'
								>
									<Icon28AddOutline width={16} height={16} />
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
								/>
							</FormItem>

							<FormItem id='article-description'>
								<FormItem.Textarea
									mode='outline'
									size='md'
									placeholder='Description'
									resize='none'
									rows={3}
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
								Pick one category for navigation. Add tags for topics and
								related articles.
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='article-category'>
								<FormItem.Select
									mode='outline'
									size='md'
									options={[
										{ label: 'External link', value: 'external-link' },
										{ label: 'Article', value: 'article' },
									]}
									value='article'
									placeholder='Select type'
								/>
							</FormItem>

							{true ? (
								<FormItem id='article-title'>
									<FormItem.Input
										mode='outline'
										size='md'
										type='text'
										placeholder='Slug'
									/>
								</FormItem>
							) : (
								<FormItem id='article-title'>
									<FormItem.Input
										mode='outline'
										size='md'
										type='text'
										placeholder='Link'
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
								<FormItem.Combobox
									mode='outline'
									size='md'
									options={[
										{ label: 'Experience', value: 'experience' },
										{ label: 'Education', value: 'education' },
										{ label: 'Skill', value: 'skill' },
										{ label: 'Tool', value: 'tool' },
										{ label: 'Other', value: 'other' },
									]}
									placeholder='Select category'
								/>
							</FormItem>

							<FormItem id='article-tags'>
								<FormItem.Autocomplete
									mode='outline'
									size='md'
									options={[
										{ label: 'Graphic Design', value: 'graphic-design' },
										{ label: 'Web Development', value: 'web-development' },
										{ label: 'SEO', value: 'seo' },
										{ label: 'Marketing', value: 'marketing' },
										{ label: 'SMM', value: 'smm' },
										{ label: 'Esports', value: 'esports' },
									]}
									placeholder='Add tags'
								/>
							</FormItem>
						</div>
					</div>
				</div>

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
								prefix={<Icon28DocumentTextOutline width={16} height={16} />}
							>
								Copy Markdown
							</Button>
						</div>
					</div>

					<Separator />

					<div className='flex'>
						<textarea
							className='w-full p-surface resize-none appearance-none outline-none text-xs font-mono placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary'
							placeholder='Write your article here...'
							rows={16}
						/>
					</div>

					<Separator />

					<div className='h-12 flex items-center p-surface gap-surface bg-surface'>
						<span className='text-xs text-foreground-secondary'>
							85 stroke, column 16
						</span>

						<Separator orientation='vertical' />

						<span className='text-xs text-foreground-secondary'>
							4 443 characters
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
							<FormItem id='article-category'>
								<FormItem.Select
									mode='outline'
									size='md'
									options={[
										{ label: 'Manual', value: 'manual' },
										{ label: 'Auto', value: 'auto' },
									]}
									value='manual'
									placeholder='Select mode'
								/>
							</FormItem>

							<div className='flex items-center gap-2'>
								<FormItem id='article-category' className='flex-1'>
									<FormItem.Combobox
										mode='outline'
										size='md'
										options={[
											{ label: 'Experience', value: 'experience' },
											{ label: 'Education', value: 'education' },
											{ label: 'Skill', value: 'skill' },
											{ label: 'Tool', value: 'tool' },
											{ label: 'Other', value: 'other' },
										]}
										placeholder='Select article'
									/>
								</FormItem>

								<Badge
									size='sm'
									mode='secondary'
									appearance='neutral'
									prefix={<Icon28CancelOutline width={12} height={12} />}
								/>
							</div>

							<Button
								className='w-full border-dashed'
								mode='outline'
								appearance='neutral'
								prefix={<Icon28AddOutline width={18} height={18} />}
								suffix={<span>1/3</span>}
								align='spread'
							>
								Add more
							</Button>
						</div>
					</div>
				</div>

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
							<h3 className='ext-xl font-medium font-condensed tracking-tight'>
								Delete article
							</h3>

							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Permanently delete the article and all associated data
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<Button
								className='w-full'
								mode='secondary'
								appearance='danger'
								prefix={<Icon28DeleteOutline width={18} height={18} />}
								align='spread'
							>
								Delete article
							</Button>
						</div>
					</div>
				</div>
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

						<Button
							type='button'
							mode='secondary'
							appearance='neutral'
							radius='rounded'
						>
							Discard changes
						</Button>

						<span className='flex-1' />

						<Button
							type='button'
							mode='ghost'
							appearance='neutral'
							radius='rounded'
						>
							Save draft
						</Button>

						<Button type='submit' radius='rounded'>
							Publish
						</Button>
					</div>
				</div>
			</section>

			<span />
		</>
	)
}
