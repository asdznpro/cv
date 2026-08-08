'use client'

import { Hero } from 'widgets/hero'

import { Badge, Button, PreviewCard, Separator } from 'ui/blocks'
import { StickerPeel } from 'ui/effects'

import { EXPERIENCE_DATA } from 'shared/data'

export default function Home() {
	return (
		<>
			<Hero />

			<section
				// style={{ contentVisibility: 'auto', containIntrinsicSize: '640px' }}
				className='mx-auto max-w-3xl w-full flex flex-col px-app gap-12'
			>
				{/* <h2 className='text-5xl font-semibold font-condensed tracking-tight'>
					7+ Years of Experience
				</h2> */}

				<div className='flex flex-col'>
					{EXPERIENCE_DATA.map(item => (
						<div key={item.id} className='flex gap-app @2xl:gap-12'>
							<aside className='relative z-0 pb-12 @2xl:pb-24'>
								{/* <div className='sticky top-24'>
									<PreviewCard
										ratio='square'
										src={item.company.logo}
										alt={item.company.name}
										width={200}
										height={200}
										className='w-18 @2xl:w-24 0outline-2 outline-accent outline-offset-6'
										radius='full'
									/>
								</div> */}

								<PreviewCard
									ratio='square'
									src={item.company.logo}
									alt={item.company.name}
									width={200}
									height={200}
									className='w-18 @2xl:w-24 0outline-2 outline-accent outline-offset-6'
									radius='full'
								/>

								{/* <StickerPeel
									imageSrc='/assets/toolkit/adobe-cc.svg'
									width={120}
									rotate={0}
									peelBackHoverPct={30}
									peelBackActivePct={40}
									shadowIntensity={0}
									lightingIntensity={0.1}
									initialPosition={{ x: 8, y: 8 }}
									peelDirection={0}
								/> */}

								<span className='absolute inset-0 -z-1 w-full h-full flex items-center justify-center'>
									<Separator orientation='vertical' />
								</span>
							</aside>

							<StickerPeel
								className='z-1'
								imageSrc={item.company.sticker.image}
								width={120}
								rotate={item.company.sticker.rotate}
								peelBackHoverPct={30}
								peelBackActivePct={40}
								shadowIntensity={0}
								lightingIntensity={0.1}
								initialPosition={{ x: -12, y: -12 }}
								peelDirection={0}
							/>

							<div className='flex flex-1 flex-col pb-12 @2xl:pb-24 gap-app @2xl:gap-8'>
								<h3 className='text-3xl @2xl:text-5xl text-balance font-semibold font-condensed tracking-tight'>
									{item.company.name} <br />{' '}
									<span className='text-foreground-secondary'>{item.role}</span>
								</h3>

								<div className='flex flex-col bg-surface border border-separator rounded-surface'>
									<div className='flex flex-col gap-6 p-6'>
										<p className='text-base @2xl:text-lg font-medium'>
											{item.employment.type}
											<br />
											{item.employment.start} —{' '}
											{item.employment.end ?? 'по н.в.'} (
											{item.employment.duration})
										</p>

										<p className='text-base @2xl:text-lg text-foreground-secondary'>
											{item.summary}
										</p>

										<div className='flex flex-wrap gap-1.5'>
											{item.tags.map(tag => (
												<Badge key={tag} mode='secondary' appearance='neutral'>
													{tag}
												</Badge>
											))}
										</div>
									</div>

									<Separator />

									<div className='flex gap-2 p-2'>
										<Button
											to={`/articles/${item.company.slug}`}
											className='flex-1'
											mode='ghost'
											appearance='neutral'
											disabled
										>
											Подробнее
										</Button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</>
	)
}
