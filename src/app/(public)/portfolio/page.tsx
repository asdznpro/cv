import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
	formatEmploymentType,
	formatExperiencePosition,
	listExperiences,
} from 'lib/experience'
import { getFormattedDate } from 'lib/utils'

import { Badge, Button, PreviewCard } from 'ui/blocks'
import { DropdownMenu, Tooltip } from 'ui/floating'

import { Icon28MoreHorizontal } from '@vkontakte/icons'

export default async function Portfolio() {
	const experiences = await listExperiences()

	return (
		<>
			<span className='h-24' />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				{experiences.map(item => (
					<Link
						key={item.id}
						href={`/portfolio/${item.company?.slug}`}
						className='flex flex-col gap-app'
					>
						<div className='flex px-surface gap-2'>
							<PreviewCard
								className='size-9'
								ratio='square'
								src={item.company?.logo}
								alt={item.company?.name ?? ''}
								sizes='90vw'
								radius='full'
							/>

							<p className='flex-1 text-balance text-3xl font-medium font-condensed tracking-tight'>
								{item.company?.name ?? ''} &nbsp;&nbsp;
								<span className='text-foreground-secondary'>
									{
										getFormattedDate(item.start_on, {
											includeTime: false,
											includeDay: false,
										}).short
									}{' '}
									—{' '}
									{item.end_on
										? getFormattedDate(item.end_on, {
												includeTime: false,
												includeDay: false,
											}).short
										: 'по н.в.'}
								</span>
							</p>

							<Button
								mode='ghost'
								appearance='neutral'
								prefix={<Icon28MoreHorizontal width={18} height={18} />}
								iconOnly
							/>
						</div>

						<PreviewCard
							ratio='video'
							src=''
							alt={item.company?.name ?? ''}
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

						<div className='flex px-surface'>
							<p className='text-foreground-secondary line-clamp-2'>
								{item.summary}
							</p>
						</div>
					</Link>
				))}
			</section>

			<span />
		</>
	)
}
