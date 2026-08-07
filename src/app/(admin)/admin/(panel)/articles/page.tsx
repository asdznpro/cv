'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Badge, Button, PreviewCard, Tabs, useTabState } from 'ui/blocks'
import { DropdownMenu } from 'ui/floating'

import {
	Icon28CalendarOutline,
	Icon28CopyOutline,
	Icon28DeleteOutline,
	Icon28EditOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28MoreHorizontal,
	Icon28ViewOutline,
} from '@vkontakte/icons'

import { ARTICLES_DATA } from 'shared/data'

export default function Articles() {
	const { tabState, handleTabSelect } = useTabState(0)

	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						Articles
					</h1>
				</div>

				{/* <ul className='flex flex-col gap-app'>
					{ARTICLES_DATA.map(article => (
						<li
							key={article.id}
							className='flex flex-col 0bg-surface 0border border-separator rounded-surface'
						>
							<PreviewCard
								ratio='4:1'
								src={article.image}
								alt={article.title}
								sizes='(max-width: 1240px) 100vw, 1240px'
								priority
							>
								<span className='z-1 absolute inset-0 mx-auto max-w-2xl w-full h-full'>
									{article.company && (
										<div className='z-1 absolute -top-4 right-6 w-20 h-20 flex items-center justify-center bg-surface border border-separator rounded-full overflow-hidden'>
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

							<div className='flex 0items-center py-surface gap-surface'>
								<div className='min-w-0 flex-1 flex flex-col gap-2'>
									<p className='text-xl font-medium font-condensed tracking-tight truncate'>
										{article.title}
									</p>

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
											prefix={<Icon28CalendarOutline width={14} height={14} />}
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
												{article.external_link}
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
												prefix={<Icon28MoreHorizontal width={18} height={18} />}
												iconOnly
											/>
										</DropdownMenu.Trigger>

										<DropdownMenu.Content className='w-32'>
											<DropdownMenu.Box>
												<DropdownMenu.Item
													aria-label='Edit company'
													prefix={<Icon28EditOutline width={18} height={18} />}
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
						</li>
					))}
				</ul> */}

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

					<div className='flex flex-col bg-surface border border-separator rounded-surface overflow-hidden'>
						{ARTICLES_DATA.map(article => (
							<div
								key={article.id}
								className='group flex flex-col not-last:border-b border-separator hover:bg-surface-secondary/60 transition-colors'
							>
								<div className='flex p-surface gap-surface'>
									<div className='flex'>
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
													<div className='z-1 absolute -bottom-2 right-2 w-9 h-9 flex items-center justify-center bg-surface border border-separator rounded-full overflow-hidden'>
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
									</div>

									<div className='min-w-0 min-h-full flex-1 flex flex-col justify-center gap-2'>
										<Link
											href={`/admin/articles/${article.id}`}
											className='text-xl font-medium font-condensed tracking-tight truncate hover:underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link rounded'
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
