'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { AnimatePresence, motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'

import {
	Badge,
	Button,
	PreviewCard,
	Separator,
	Tabs,
	useTabState,
} from 'ui/blocks'
import { Checkbox } from 'ui/forms'
import { DropdownMenu } from 'ui/floating'

import {
	Icon28CalendarOutline,
	Icon28CancelOutline,
	Icon28ChevronDownOutline,
	Icon28CopyOutline,
	Icon28DeleteOutline,
	Icon28EditOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28MoreHorizontal,
	Icon28SortOutline,
	Icon28ViewOutline,
} from '@vkontakte/icons'

import { ARTICLES_DATA } from 'shared/data'

export default function Articles() {
	const { tabState, handleTabSelect } = useTabState(0)
	const [selectedIds, setSelectedIds] = useState<number[]>([])

	const allIds = ARTICLES_DATA.map(article => article.id)
	const allSelected = allIds.length > 0 && selectedIds.length === allIds.length
	const someSelected = selectedIds.length > 0 && !allSelected

	function toggleAll() {
		setSelectedIds(allSelected ? [] : allIds)
	}

	function toggleOne(id: number) {
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
		)
	}

	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						Articles
					</h1>
				</div>

				<div className='flex flex-col'>
					<Tabs
						className='px-surface border-none'
						initialIndex={tabState}
						onTabSelect={handleTabSelect}
					>
						<Tabs.Item>All</Tabs.Item>
						<Tabs.Item>Posted</Tabs.Item>
						<Tabs.Item>Drafts</Tabs.Item>
						<Tabs.Item>Scheduled</Tabs.Item>
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
													onClick={toggleAll}
													type='button'
													size='sm'
													mode='ghost'
													appearance='neutral'
												>
													Select all
												</Button>

												<Separator orientation='vertical' />

												<Button
													type='button'
													size='sm'
													mode='ghost'
													appearance='neutral'
													prefix={<Icon28ViewOutline width={16} height={16} />}
													suffix={
														<Icon28ChevronDownOutline width={16} height={16} />
													}
												>
													Visibility
												</Button>

												<Button
													type='button'
													size='sm'
													mode='ghost'
													appearance='danger'
													prefix={
														<Icon28DeleteOutline width={16} height={16} />
													}
												>
													Delete
												</Button>

												<Button
													onClick={() => setSelectedIds([])}
													className='ml-auto'
													type='button'
													size='sm'
													mode='ghost'
													appearance='neutral'
													prefix={
														<Icon28CancelOutline width={16} height={16} />
													}
													iconOnly
												/>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							<div className='h-12 flex items-center px-surface gap-surface'>
								<Checkbox
									aria-label='Select all articles'
									checked={allSelected}
									indeterminate={someSelected}
									onChange={toggleAll}
								/>

								<span className='flex-1 text-foreground-secondary text-sm truncate'>
									{selectedIds.length > 0
										? `${selectedIds.length} selected`
										: `${ARTICLES_DATA.length} articles`}
								</span>

								<Button
									type='button'
									size='sm'
									mode='secondary'
									appearance='neutral'
									prefix={<Icon28SortOutline width={16} height={16} />}
								>
									Sort by
								</Button>
							</div>
						</div>

						<Separator />

						{ARTICLES_DATA.map(article => (
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
										src={article.image}
										alt={article.title}
										radius='sm'
										sizes='(max-width: 1240px) 100vw, 1240px'
										priority
									>
										<span className='z-1 absolute inset-0 mx-auto max-w-2xl w-full h-full'>
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
												appearance='neutral'
												prefix={<Icon28ViewOutline width={14} height={14} />}
											>
												127
											</Badge>

											<Badge
												size='md'
												mode='soft'
												appearance='neutral'
												prefix={
													<Icon28CalendarOutline width={14} height={14} />
												}
											>
												{article.created_at}
											</Badge>

											<Badge
												size='md'
												mode='soft'
												appearance='neutral'
												prefix={<Icon28HashtagOutline width={14} height={14} />}
											>
												{article.category.slug}
											</Badge>

											{article.external_link && (
												<Badge
													size='md'
													mode='soft'
													appearance='neutral'
													prefix={<Icon28GlobeOutline width={14} height={14} />}
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
													<DropdownMenu.Item
														aria-label='Preview article'
														prefix={
															<Icon28ViewOutline width={18} height={18} />
														}
													>
														Preview
													</DropdownMenu.Item>

													<DropdownMenu.Item
														aria-label='Duplicate article'
														prefix={
															<Icon28CopyOutline width={18} height={18} />
														}
													>
														Duplicate
													</DropdownMenu.Item>

													<DropdownMenu.Item
														aria-label='Edit company'
														to={`/admin/articles/${article.id}`}
														prefix={
															<Icon28EditOutline width={18} height={18} />
														}
													>
														Edit
													</DropdownMenu.Item>

													<DropdownMenu.Item
														aria-label='Delete company'
														appearance='danger'
														prefix={
															<Icon28DeleteOutline width={18} height={18} />
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
						))}
					</div>
				</div>
			</section>

			<span />
		</>
	)
}
