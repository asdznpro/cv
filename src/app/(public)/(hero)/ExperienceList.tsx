'use client'

import {
	formatEmploymentType,
	formatExperiencePosition,
	type Experience,
} from 'lib/experience'
import { formatEmploymentDuration, getFormattedDate } from 'lib/utils'

import { Badge, Button, PreviewCard, Separator } from 'ui/blocks'
import { Tooltip } from 'ui/floating'
import { StickerPeel } from 'ui/effects'

type ExperienceListProps = {
	experiences: Experience[]
}

export function ExperienceList({ experiences }: ExperienceListProps) {
	if (experiences.length === 0) return null

	return (
		<section className='mx-auto max-w-3xl w-full flex flex-col px-app gap-12'>
			<div className='flex flex-col'>
				{experiences.map(item => {
					const articleHref = item.article?.slug
						? `/articles/${item.article.slug}`
						: undefined

					return (
						<div key={item.id} className='flex gap-app @2xl:gap-12'>
							<aside className='relative z-0 pb-12 @2xl:pb-24'>
								<PreviewCard
									ratio='square'
									src={item.company?.logo}
									alt={item.company?.name ?? ''}
									width={200}
									height={200}
									className='w-18 @2xl:w-24 0outline-2 outline-accent outline-offset-6'
									radius='full'
								/>

								<span className='absolute inset-0 -z-1 w-full h-full flex items-center justify-center'>
									<Separator orientation='vertical' />
								</span>
							</aside>

							{item.stickers[0] && (
								<StickerPeel
									width={120}
									imageSrc={item.stickers[0].url}
									rotate={item.stickers[0].rotate}
									initialPosition={{ x: -12, y: -12 }}
								/>
							)}

							<div className='flex flex-1 flex-col pb-12 @2xl:pb-24 gap-app @2xl:gap-8'>
								<h3 className='text-3xl @2xl:text-5xl text-balance font-semibold font-condensed tracking-tight'>
									{item.company?.name ?? 'Company'} <br />{' '}
									<span className='text-foreground-secondary'>
										{item.positions.map(formatExperiencePosition).join(', ')}
									</span>
								</h3>

								<div className='flex flex-col bg-surface border border-separator rounded-surface'>
									<div className='flex flex-col gap-6 p-6'>
										<p className='text-base @2xl:text-lg font-medium'>
											{formatEmploymentType(item.employment_type)}
											<br />
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

										<p className='text-base @2xl:text-lg text-foreground-secondary'>
											{item.summary}
										</p>

										{item.skills.length > 0 && (
											<div className='flex flex-wrap gap-1.5'>
												{item.skills.map(skill => (
													<Badge
														key={skill}
														mode='secondary'
														appearance='neutral'
													>
														{skill}
													</Badge>
												))}
											</div>
										)}

										{/* {item.stickers[1] && (
											<StickerPeel
												width={120}
												imageSrc={item.stickers[1].url}
												rotate={item.stickers[1].rotate}
												initialPosition={'center'}
											/>
										)} */}
									</div>

									{articleHref && (
										<>
											<Separator />

											<div className='flex gap-2 p-2'>
												<Tooltip
													triggerClassName='min-w-0 flex-1'
													text={item.article?.title}
												>
													<Button
														to={articleHref}
														className='w-full'
														mode='ghost'
														appearance='neutral'
													>
														Read more
													</Button>
												</Tooltip>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</section>
	)
}
