'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
	formatEmploymentType,
	formatExperiencePosition,
	type Experience,
} from 'lib/experience'
import { formatEmploymentDuration, getFormattedDate } from 'lib/utils'

import { Badge, Button, PreviewCard, Separator } from 'ui/blocks'
import { StickerPeel } from 'ui/effects'
import { DropdownMenu, Tooltip } from 'ui/floating'
import { useOverlay } from 'ui/overlays'

import {
	Icon28HashtagOutline,
	Icon28GlobeOutline,
	Icon28MoreHorizontal,
	Icon28EditOutline,
	Icon28DeleteOutline,
	Icon28AddOutline,
} from '@vkontakte/icons'

import { DeleteExperienceDialog } from './DeleteExperienceDialog'

type ExperienceManagerProps = {
	experiences: Experience[]
}

export function ExperienceManager({ experiences }: ExperienceManagerProps) {
	const router = useRouter()
	const { open, close } = useOverlay()

	function openDelete(experience: Experience) {
		open(
			<DeleteExperienceDialog
				experience={experience}
				onCancel={() => close()}
				onSuccess={() => {
					close()
					router.refresh()
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	return (
		<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
			<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
				<div className='flex flex-1 flex-col gap-3'>
					<h1 className='text-3xl font-medium font-condensed tracking-tight'>
						Experience Manager
					</h1>
				</div>

				<div className='flex self-start gap-2'>
					<Tooltip text='Add experience'>
						<Button
							to='/admin/experience/new'
							mode='secondary'
							appearance='neutral'
							prefix={<Icon28AddOutline width={18} height={18} />}
							iconOnly
						/>
					</Tooltip>
				</div>
			</div>

			{experiences.length === 0 ? (
				<p className='text-foreground-secondary'>No experience yet</p>
			) : (
				<ul className='flex flex-col gap-app'>
					{experiences.map(item => {
						const sticker = item.stickers[0]
						return (
							<li
								key={item.id}
								className='flex flex-col bg-surface border border-separator rounded-surface'
							>
								<div className='flex p-surface gap-surface'>
									<PreviewCard
										className='size-14'
										ratio='square'
										src={item.company?.logo}
										alt={item.company?.name ?? ''}
										radius='full'
										sizes='(max-width: 1240px) 100vw, 1240px'
									/>

									{sticker && (
										<StickerPeel
											width={68}
											imageSrc={sticker.url}
											rotate={sticker.rotate}
											initialPosition={{ x: -6, y: -6 }}
										/>
									)}

									<div className='min-w-0 flex-1 flex flex-col gap-2'>
										<h2 className='text-xl text-balance font-semibold font-condensed tracking-tight'>
											{item.company?.name ?? 'Company'} <br />{' '}
											<span className='text-foreground-secondary'>
												{item.positions
													.map(formatExperiencePosition)
													.join(', ')}
											</span>
										</h2>

										<span className='flex flex-wrap gap-1'>
											{item.company?.slug && (
												<Badge
													size='sm'
													mode='soft'
													appearance='neutral'
													prefix={
														<Icon28HashtagOutline width={12} height={12} />
													}
												>
													{item.company.slug}
												</Badge>
											)}

											{item.company?.url && (
												<Badge
													size='sm'
													mode='soft'
													appearance='neutral'
													prefix={<Icon28GlobeOutline width={12} height={12} />}
												>
													{item.company.url.split('/')[2]}
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
														to={`/admin/experience/${item.id}`}
														aria-label='Edit experience'
														prefix={
															<Icon28EditOutline width={18} height={18} />
														}
													>
														Edit
													</DropdownMenu.Item>

													<DropdownMenu.Item
														onClick={() => openDelete(item)}
														aria-label='Delete experience'
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

								<Separator />

								<div className='flex flex-col p-surface gap-app text-sm'>
									<div className='flex flex-col @md:grid grid-cols-4 gap-2'>
										<p className='text-foreground-secondary'>
											Employment type:
										</p>

										<p className='col-span-3'>
											{formatEmploymentType(item.employment_type)}
										</p>
									</div>

									<div className='flex flex-col @md:grid grid-cols-4 gap-2'>
										<p className='text-foreground-secondary'>Time period:</p>

										<p className='col-span-3'>
											{
												getFormattedDate(item.start_on, {
													includeTime: false,
													includeDay: false,
												}).full
											}{' '}
											—{' '}
											{item.end_on
												? getFormattedDate(item.end_on, {
														includeTime: false,
														includeDay: false,
													}).full
												: 'по н.в.'}{' '}
											({formatEmploymentDuration(item.start_on, item.end_on)})
										</p>
									</div>

									<div className='flex flex-col @md:grid grid-cols-4 gap-2'>
										<p className='text-foreground-secondary'>Summary:</p>

										<p className='col-span-3 line-clamp-3'>{item.summary}</p>
									</div>

									<div className='flex flex-col @md:grid grid-cols-4 gap-2'>
										<p className='text-foreground-secondary'>
											Connected article:
										</p>

										<div className='col-span-3 flex'>
											{item.article ? (
												<Link
													href={
														item.article.slug
															? `/articles/${item.article.slug}`
															: `/admin/articles/${item.article.id}`
													}
													className='w-fit font-medium underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link'
												>
													{item.article.title}
												</Link>
											) : (
												<span className='text-foreground-secondary'>—</span>
											)}
										</div>
									</div>

									<div className='flex flex-col @md:grid grid-cols-4 gap-2'>
										<p className='text-foreground-secondary'>Skills:</p>

										<div className='col-span-3 flex flex-wrap gap-1'>
											{item.skills.map(skill => (
												<Badge
													key={skill}
													size='sm'
													mode='soft'
													appearance='neutral'
												>
													{skill}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			)}
		</section>
	)
}
