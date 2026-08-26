'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import {
	SHORT_LINK_HOST,
	shortLinkHref,
	stripUrlProtocol,
	type ShortLink,
} from 'lib/short-links'
import { getFormattedDate } from 'lib/utils'

import { Badge, Button, ScrollArea, Separator } from 'ui/blocks'
import { Checkbox } from 'ui/forms'
import { DropdownMenu, Tooltip } from 'ui/floating'
import { useOverlay } from 'ui/overlays'

import {
	Icon28ChainOutline,
	Icon28CopyOutline,
	Icon28UsersOutline,
	Icon28MoreHorizontal,
	Icon28EditOutline,
	Icon28DeleteOutline,
	Icon28StatisticsOutline,
	Icon28HandPointUpOutline,
	Icon28SortOutline,
	Icon28DoneOutline,
} from '@vkontakte/icons'

import { CreateShortLinkForm } from './CreateShortLinkForm'
import { DeleteShortLinkDialog } from './DeleteShortLinkDialog'
import { ShortLinkFormDialog } from './ShortLinkFormDialog'
import { ShortLinkVisitsDialog } from './ShortLinkVisitsDialog'

type SortField =
	| 'title'
	| 'date'
	| 'views'
	| 'views_24h'
	| 'visitors'
	| 'visitors_24h'

type SortOrder = 'asc' | 'desc'

const DEFAULT_SORT: SortField = 'views_24h'
const DEFAULT_ORDER: SortOrder = 'desc'

function sortValue(link: ShortLink, field: SortField) {
	switch (field) {
		case 'title':
			return (link.title || link.slug).toLocaleLowerCase()
		case 'date':
			return Date.parse(link.created_at)
		case 'views':
			return link.clicks
		case 'views_24h':
			return link.clicks_24h
		case 'visitors':
			return link.unique_visitors ?? 0
		case 'visitors_24h':
			return link.uniques_24h
	}
}

function compareLinks(
	a: ShortLink,
	b: ShortLink,
	field: SortField,
	order: SortOrder,
) {
	const direction = order === 'asc' ? 1 : -1
	const left = sortValue(a, field)
	const right = sortValue(b, field)

	if (typeof left === 'string' && typeof right === 'string') {
		const byTitle = left.localeCompare(right, undefined, { numeric: true })
		if (byTitle !== 0) return byTitle * direction
	} else if (left !== right) {
		return ((left as number) - (right as number)) * direction
	}

	return Date.parse(b.created_at) - Date.parse(a.created_at)
}

function sortItemProps(active: boolean) {
	return {
		mode: (active ? 'secondary' : 'ghost') as 'secondary' | 'ghost',
		suffix: (
			<Icon28DoneOutline
				className={twMerge(!active && 'opacity-0 group-hover:opacity-40')}
				width={18}
				height={18}
			/>
		),
	}
}

type ShortenerManagerProps = {
	links: ShortLink[]
}

export function ShortenerManager({ links }: ShortenerManagerProps) {
	const { open, close } = useOverlay()
	const router = useRouter()
	const [sortField, setSortField] = useState<SortField>(DEFAULT_SORT)
	const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_ORDER)

	const sortedLinks = useMemo(
		() => [...links].sort((a, b) => compareLinks(a, b, sortField, sortOrder)),
		[links, sortField, sortOrder],
	)

	const viewsSelected = sortField === 'views' || sortField === 'views_24h'
	const visitorsSelected =
		sortField === 'visitors' || sortField === 'visitors_24h'

	const openEdit = (link: ShortLink) => {
		open(
			<ShortLinkFormDialog
				link={link}
				onCancel={() => close()}
				onSuccess={() => {
					close()
					router.refresh()
				}}
			/>,
		)
	}

	const openDelete = (link: ShortLink) => {
		open(
			<DeleteShortLinkDialog
				link={link}
				onCancel={() => close()}
				onSuccess={() => {
					close()
					router.refresh()
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	const openVisits = (link: ShortLink) => {
		open(<ShortLinkVisitsDialog link={link} onClose={() => close()} />, {
			className: 'max-w-xl',
		})
	}

	async function copyHref(slug: string) {
		try {
			await navigator.clipboard.writeText(shortLinkHref(slug))
			toast.success('Ссылка скопирована')
		} catch {
			toast.error('Не удалось скопировать')
		}
	}

	return (
		<>
			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						URL Shortener
					</h1>

					{/* <p className='text-foreground-secondary text-balance'>
						Create short links to your website or social media profiles
					</p> */}
				</div>

				<div className='relative flex'>
					<CreateShortLinkForm />

					<span className='-z-1 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 container w-[160%] aspect-square animate-[fade-in_1000ms_ease-out] bg-radial from-accent/20 to-60% to-background pointer-events-none' />
				</div>
			</section>

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Shortened Links
						</h2>
					</div>
				</div>

				<div className='flex flex-col bg-background border border-separator rounded-surface overflow-hidden'>
					<div className='flex flex-col bg-surface'>
						<div className='h-12 flex items-center px-surface gap-surface'>
							{/* <Checkbox
								aria-label='Select page articles'
								// checked={pageSelected}
								// indeterminate={somePageSelected}
								// onChange={togglePage}
							/> */}

							<span className='flex-1 text-foreground-secondary text-sm truncate'>
								{links.length > 0 ? `${links.length} links` : 'No links'}
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
										<DropdownMenu.Heading>Sort by</DropdownMenu.Heading>

										<DropdownMenu.Item
											aria-label='By title'
											onClick={() => setSortField('title')}
											{...sortItemProps(sortField === 'title')}
										>
											Title
										</DropdownMenu.Item>

										<DropdownMenu.Item
											aria-label='By date'
											onClick={() => setSortField('date')}
											{...sortItemProps(sortField === 'date')}
										>
											Date
										</DropdownMenu.Item>

										<DropdownMenu.Sub>
											<DropdownMenu.SubTrigger
												aria-label='By views'
												mode={viewsSelected ? 'secondary' : 'ghost'}
											>
												Views
											</DropdownMenu.SubTrigger>

											<DropdownMenu.SubContent className='w-40'>
												<DropdownMenu.Box>
													<DropdownMenu.Item
														aria-label='By total views'
														onClick={() => setSortField('views')}
														{...sortItemProps(sortField === 'views')}
													>
														Default
													</DropdownMenu.Item>

													<DropdownMenu.Item
														aria-label='By views in last 24h'
														onClick={() => setSortField('views_24h')}
														{...sortItemProps(sortField === 'views_24h')}
													>
														Last 24h first
													</DropdownMenu.Item>
												</DropdownMenu.Box>
											</DropdownMenu.SubContent>
										</DropdownMenu.Sub>

										<DropdownMenu.Sub>
											<DropdownMenu.SubTrigger
												aria-label='By visitors'
												mode={visitorsSelected ? 'secondary' : 'ghost'}
											>
												Visitors
											</DropdownMenu.SubTrigger>

											<DropdownMenu.SubContent className='w-40'>
												<DropdownMenu.Box>
													<DropdownMenu.Item
														aria-label='By total visitors'
														onClick={() => setSortField('visitors')}
														{...sortItemProps(sortField === 'visitors')}
													>
														Default
													</DropdownMenu.Item>

													<DropdownMenu.Item
														aria-label='By visitors in last 24h'
														onClick={() => setSortField('visitors_24h')}
														{...sortItemProps(sortField === 'visitors_24h')}
													>
														Last 24h first
													</DropdownMenu.Item>
												</DropdownMenu.Box>
											</DropdownMenu.SubContent>
										</DropdownMenu.Sub>
									</DropdownMenu.Box>

									<DropdownMenu.Box>
										<DropdownMenu.Heading>Order by</DropdownMenu.Heading>

										<DropdownMenu.Item
											aria-label='Increasing'
											onClick={() => setSortOrder('asc')}
											{...sortItemProps(sortOrder === 'asc')}
										>
											Ascending
										</DropdownMenu.Item>

										<DropdownMenu.Item
											aria-label='Decreasing'
											onClick={() => setSortOrder('desc')}
											{...sortItemProps(sortOrder === 'desc')}
										>
											Descending
										</DropdownMenu.Item>
									</DropdownMenu.Box>
								</DropdownMenu.Content>
							</DropdownMenu>
						</div>
					</div>

					<Separator />

					{links.length === 0 ? (
						<div className='min-h-40 flex items-center justify-center p-surface'>
							<p className='text-center text-sm text-foreground-secondary'>
								No short links
							</p>
						</div>
					) : (
						<ScrollArea className='max-h-[80vh]'>
							{sortedLinks.map((link, index) => (
								<div key={link.id}>
									<div className='flex items-center p-surface gap-surface'>
										<div className='flex flex-1 flex-col gap-3 min-w-0'>
											<p className='text-balance text-xl font-medium font-condensed tracking-tight'>
												{link.title && link.title + ': '}

												<a
													href={shortLinkHref(link.slug)}
													target='_blank'
													rel='noopener noreferrer'
													className={twMerge(
														'root w-fit hover:underline hover:text-link transition-colors',
														link.title && 'text-foreground-secondary',
													)}
												>
													{SHORT_LINK_HOST}/{link.slug}
												</a>
											</p>

											<span className='flex flex-wrap gap-1'>
												<Tooltip text='Clicks (last 24h in parentheses)'>
													<Badge
														size='md'
														mode='soft'
														appearance={
															link.clicks_24h > 0 ? 'success' : 'neutral'
														}
														prefix={
															<Icon28HandPointUpOutline
																width={14}
																height={14}
															/>
														}
													>
														{link.clicks}
														{link.clicks_24h > 0 && ' +' + link.clicks_24h}
													</Badge>
												</Tooltip>

												<Tooltip text='Unique visitors (last 24h in parentheses)'>
													<Badge
														size='md'
														mode='soft'
														appearance={
															link.uniques_24h > 0 ? 'success' : 'neutral'
														}
														prefix={
															<Icon28UsersOutline width={14} height={14} />
														}
													>
														{link.unique_visitors ?? 0}
														{link.uniques_24h > 0 && ' +' + link.uniques_24h}
													</Badge>
												</Tooltip>

												<Badge size='md' mode='soft' appearance='neutral'>
													{getFormattedDate(link.created_at, false).short}
												</Badge>

												<Badge
													className='max-w-52'
													size='md'
													mode='soft'
													appearance='neutral'
													prefix={<Icon28ChainOutline width={14} height={14} />}
												>
													{stripUrlProtocol(link.target_url)}
												</Badge>
											</span>
										</div>

										<div className='flex gap-2 shrink-0'>
											<Button
												onClick={() => copyHref(link.slug)}
												aria-label='Copy'
												mode='soft'
												appearance='neutral'
												prefix={<Icon28CopyOutline width={18} height={18} />}
												iconOnly
											/>

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
															aria-label='Stats of short link'
															prefix={
																<Icon28StatisticsOutline
																	width={18}
																	height={18}
																/>
															}
														>
															Stats
														</DropdownMenu.Item>

														<DropdownMenu.Item
															onClick={() => openVisits(link)}
															aria-label='Visits of short link'
															prefix={
																<Icon28UsersOutline width={18} height={18} />
															}
														>
															Visits
														</DropdownMenu.Item>

														<DropdownMenu.Item
															onClick={() => openEdit(link)}
															aria-label='Edit short link'
															prefix={
																<Icon28EditOutline width={18} height={18} />
															}
														>
															Edit
														</DropdownMenu.Item>

														<DropdownMenu.Item
															onClick={() => openDelete(link)}
															aria-label='Delete short link'
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

									{index !== sortedLinks.length - 1 && <Separator />}
								</div>
							))}
						</ScrollArea>
					)}
				</div>
			</section>
		</>
	)
}
