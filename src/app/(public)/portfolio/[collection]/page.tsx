import { formatExperiencePosition, listExperiences } from 'lib/experience'
import { formatEmploymentDuration, getFormattedDate } from 'lib/utils'

import { PORTFOLIO_ITEMS } from 'shared/data'

import {
	Badge,
	Button,
	PreviewCard,
	Separator,
	type PreviewCardProps,
} from 'ui/blocks'
import { StickerPeel } from 'ui/effects'
import { DropdownMenu, Tooltip } from 'ui/floating'

import {
	Icon28ArrowLeftOutline,
	Icon28DeleteOutline,
	Icon28EditOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28MoreHorizontal,
} from '@vkontakte/icons'

export default async function Portfolio() {
	const experiences = await listExperiences()
	const [experience] = experiences

	return (
		<>
			<span className='h-24' />

			<section className='mx-auto max-w-6xl w-full flex flex-col items-center px-app gap-app'>
				<div className='max-w-xl w-full flex flex-col gap-app'>
					<div className='flex @lg:grid grid-cols-4 items-center px-surface gap-surface'>
						<Button
							to='/portfolio'
							className='col-start-2 col-span-2'
							mode='ghost'
							appearance='neutral'
							prefix={<Icon28ArrowLeftOutline width={18} height={18} />}
							align='spread'
						>
							Back to Portfolio
						</Button>
					</div>

					<div className='flex flex-col bg-surface border border-separator rounded-surface'>
						<div className='flex @lg:grid grid-cols-4 p-surface gap-surface'>
							<PreviewCard
								className='size-20'
								ratio='square'
								src={experience.company?.logo}
								alt={experience.company?.name ?? ''}
								radius='full'
								sizes='(max-width: 1240px) 100vw, 1240px'
							/>

							{experience.stickers[0] && (
								<StickerPeel
									width={96}
									imageSrc={experience.stickers[0].url}
									rotate={experience.stickers[0].rotate}
									initialPosition={{ x: -8, y: -8 }}
								/>
							)}

							<div className='col-span-2 min-w-0 flex-1 flex flex-col gap-2'>
								<h1 className='text-3xl text-balance font-semibold font-condensed tracking-tight'>
									{experience.company?.name ?? 'Company'} <br />{' '}
									<span className='text-foreground-secondary'>
										{experience.positions
											.map(formatExperiencePosition)
											.join(', ')}
									</span>
								</h1>

								<p className='text-foreground-secondary'>
									{'@' +
										experience.company?.slug +
										' • ' +
										'0 creatives' +
										' • ' +
										'0 views'}
								</p>
							</div>

							<div className='flex justify-self-end gap-2'>
								<Button
									mode='ghost'
									appearance='neutral'
									prefix={<Icon28MoreHorizontal width={18} height={18} />}
									iconOnly
								/>
							</div>
						</div>

						<Separator />

						<div className='flex flex-col p-surface gap-surface'>
							<div className='flex flex-col @lg:grid grid-cols-4 gap-x-app gap-y-2'>
								<p className='text-foreground-secondary'>Time period:</p>

								<p className='col-span-3'>
									{
										getFormattedDate(experience.start_on, {
											includeTime: false,
											includeDay: false,
										}).full
									}{' '}
									—{' '}
									{experience.end_on
										? getFormattedDate(experience.end_on, {
												includeTime: false,
												includeDay: false,
											}).full
										: 'по н.в.'}{' '}
									(
									{formatEmploymentDuration(
										experience.start_on,
										experience.end_on,
									)}
									)
								</p>
							</div>

							<div className='flex flex-col @lg:grid grid-cols-4 gap-x-app gap-y-2'>
								<p className='text-foreground-secondary'>Summary:</p>

								<p className='col-span-3 line-clamp-3'>{experience.company?.summary ?? ''}</p>
							</div>

							{experience.skills.length > 0 && (
								<div className='flex flex-col @lg:grid grid-cols-4 gap-2'>
									<p className='text-foreground-secondary'>Skills:</p>

									<div className='col-span-3 flex flex-wrap gap-1'>
										{experience.skills.map(skill => (
											<Badge
												key={skill}
												size='md'
												mode='soft'
												appearance='neutral'
											>
												{skill}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>

						{/* <Separator /> */}

						{/* <div className='flex gap-2 p-2'>
							<Button className='flex-1' size='sm'>
								Read more
							</Button>

							<Tooltip
								triggerClassName='flex-1'
								text={'Read more about this experience'}
							>
								<Button
									className='flex-1'
									size='sm'
									mode='secondary'
									appearance='neutral'
								>
									Read more
								</Button>
							</Tooltip>
						</div> */}

						{/* <div className='flex @lg:grid grid-cols-4 items-center p-surface gap-surface'>
							<Button
								className='col-start-2'
								appearance='neutral'
								prefix={<Icon28ArrowLeftOutline width={18} height={18} />}
								align='spread'
							>
								Back to Portfolio
							</Button>

							<Button
								className='col-start-3'
								mode='secondary'
								appearance='neutral'
								prefix={<Icon28ArrowLeftOutline width={18} height={18} />}
								align='spread'
							>
								Back to Portfolio
							</Button>
						</div> */}
					</div>

					<div className='w-full flex justify-center gap-1'>
						{[...Array(5)].map((_, index) => (
							<div
								key={index}
								className='max-w-22 min-w-0 flex flex-col items-center p-app gap-app 0bg-surface-secondary 0border border-separator rounded-surface'
							>
								<PreviewCard
									ratio='square'
									src=''
									alt=''
									width={200}
									height={200}
									className='size-14 outline-2 outline-accent outline-offset-4'
									radius='full'
								/>

								<p className='w-full text-sm text-center font-medium font-condensed tracking-tight truncate'>
									Some Highlight
								</p>
							</div>
						))}
					</div>
				</div>

				<div className='w-full columns-1 @sm:columns-2 @2xl:columns-3 @4xl:columns-5 gap-1 *:break-inside-avoid *:mt-0! *:mb-1!'>
					{PORTFOLIO_ITEMS.map(item => (
						<div key={item.id} className='flex flex-col gap-2'>
							<PreviewCard
								ratio={item.image.ratio as PreviewCardProps['ratio']}
								src={item.image.url}
								alt={item.name}
								sizes='90vw'
								className='w-full'
							>
								{/* <span className='z-1 absolute inset-0 w-full h-full'>
									{item.company && (
										<div className='z-1 absolute -bottom-2 right-2 size-9 flex items-center justify-center bg-surface border border-separator rounded-full overflow-hidden'>
											<Image
												className='w-full h-full object-cover'
												src={item.company.logo}
												alt={item.company.name}
												width={200}
												height={200}
											/>
										</div>
									)}
								</span> */}
							</PreviewCard>
						</div>
					))}
				</div>
			</section>

			<span />
		</>
	)
}
