'use client'

import Link from 'next/link'

import { getFormattedDate } from 'lib/utils'

import { Badge, Button, PreviewCard, Separator } from 'ui/blocks'
import { StickerPeel } from 'ui/effects'
import { DropdownMenu, Tooltip } from 'ui/floating'

import {
	Icon28HashtagOutline,
	Icon28GlobeOutline,
	Icon28MoreHorizontal,
	Icon28EditOutline,
	Icon28DeleteOutline,
	Icon28AddOutline,
} from '@vkontakte/icons'

import { EXPERIENCE_DATA } from 'shared/data'

export default function Experience() {
	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-1 flex-col gap-3'>
						<h1 className='text-3xl font-medium font-condensed tracking-tight'>
							Experience Manager
						</h1>

						<p className='text-sm text-foreground-secondary'>
							If your hardware supports this feature we we automatically lay of
							the processing to the hardware. Otherwise our built in software
							algorithm is used.
						</p>
					</div>

					<div className='flex self-start gap-2'>
						<Tooltip text='Add experience'>
							<Button
								// to='/admin/articles/new'
								mode='secondary'
								appearance='neutral'
								prefix={<Icon28AddOutline width={18} height={18} />}
								iconOnly
							/>
						</Tooltip>
					</div>
				</div>

				{EXPERIENCE_DATA.length === 0 ? (
					<p className='text-foreground-secondary'>Пока нет компаний</p>
				) : (
					<ul className='flex flex-col gap-app'>
						{EXPERIENCE_DATA.map(item => (
							<li
								key={item.id}
								className='flex flex-col bg-surface border border-separator rounded-surface'
							>
								<div className='flex p-surface gap-surface'>
									<PreviewCard
										className='size-14'
										ratio='square'
										src={item.company.logo}
										alt={item.company.name}
										radius='full'
										sizes='(max-width: 1240px) 100vw, 1240px'
									/>

									<StickerPeel
										width={68}
										imageSrc={item.company.sticker.image}
										rotate={item.company.sticker.rotate}
										initialPosition={{ x: -6, y: -6 }}
									/>

									<div className='min-w-0 flex-1 flex flex-col gap-2'>
										<h2 className='text-xl text-balance font-semibold font-condensed tracking-tight'>
											{item.company.name} <br />{' '}
											<span className='text-foreground-secondary'>
												{item.role}
											</span>
										</h2>

										<span className='flex flex-wrap gap-1'>
											<Badge
												size='sm'
												mode='soft'
												appearance='neutral'
												prefix={<Icon28HashtagOutline width={12} height={12} />}
											>
												{item.company.slug}
											</Badge>

											{item.company.url && (
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
														// onClick={() => openCompanyForm(company)}
														aria-label='Edit company'
														prefix={
															<Icon28EditOutline width={18} height={18} />
														}
													>
														Edit
													</DropdownMenu.Item>

													<DropdownMenu.Item
														// onClick={() => openDeleteCompany(company)}
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

								<Separator />

								<div className='flex flex-col p-surface gap-app text-sm'>
									<div className='flex flex-col @md:grid grid-cols-4 gap-2'>
										<p className='text-foreground-secondary'>
											Employment type:
										</p>

										<p className='col-span-3'>{item.employment.type}</p>
									</div>

									<div className='flex flex-col @md:grid grid-cols-4 gap-2'>
										<p className='text-foreground-secondary'>Time period:</p>

										<p className='col-span-3'>
											{getFormattedDate(item.employment.start, false).full} —{' '}
											{item.employment.end
												? getFormattedDate(item.employment.end, false).full
												: 'по н.в.'}{' '}
											({item.employment.duration})
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
											<Link
												href={`/articles/${item.company.slug}`}
												className='w-fit font-medium underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link'
											>
												Очень длинное название статьи
											</Link>
										</div>
									</div>

									<div className='flex flex-col @md:grid grid-cols-4 gap-2'>
										<p className='text-foreground-secondary'>Tags:</p>

										<div className='col-span-3 flex flex-wrap gap-1'>
											{item.tags.map(tag => (
												<Badge
													key={tag}
													size='sm'
													mode='secondary'
													appearance='neutral'
												>
													{tag}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>

			<span />
		</>
	)
}
