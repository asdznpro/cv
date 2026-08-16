'use client'

import Image from 'next/image'

import type { ToolkitItem } from 'lib/toolkit'

import { Badge, Carousel } from 'ui/blocks'
import { Lanyard, PixelBlast } from 'ui/effects'

import { Icon28WrenchOutline } from '@vkontakte/icons'

type HeroProps = {
	items: ToolkitItem[]
}

export function Hero({ items }: HeroProps) {
	return (
		<div className='w-full h-screen flex flex-col p-2 gap-2'>
			<div className='relative z-0 w-full h-full rounded-xl border border-separator bg-blue-950/40 overflow-hidden'>
				<Badge
					className='absolute bottom-app right-1/2 translate-x-1/2'
					appearance='danger'
					prefix={<Icon28WrenchOutline width={18} height={18} />}
				>
					In the process of active development
				</Badge>

				<div className='absolute inset-0'>
					<Lanyard
						position={[0, 0, 14]}
						gravity={[0, -40, 0]}
						frontImage='/assets/lanyard/front.png'
						backImage='/assets/lanyard/back.png'
						lanyardImage='/assets/lanyard/band.png'
						imageFit='cover'
						lanyardWidth={0.6}
					/>
				</div>

				<div className='absolute inset-0 -z-10'>
					<PixelBlast
						variant='square'
						pixelSize={2}
						color='#ce1290'
						patternScale={1}
						patternDensity={1}
						enableRipples={false}
						speed={0.9}
						transparent
						edgeFade={0}
					/>
				</div>

				<div className='absolute inset-0 -z-10'>
					<PixelBlast
						variant='square'
						pixelSize={2}
						color='#1212ce'
						patternScale={1}
						patternDensity={1.5}
						enableRipples={false}
						speed={0.9}
						transparent
						edgeFade={0}
					/>
				</div>
			</div>

			<div className='relative z-0 w-full flex py-2 rounded-xl border border-separator bg-background overflow-hidden shrink-0'>
				<Carousel.Root
					options={{
						align: 'center',
						skipSnaps: true,
						loop: true,
					}}
					autoScroll={{
						speed: 1.5,
						startDelay: 100,
						stopOnInteraction: false,
						stopOnMouseEnter: true,
					}}
				>
					<Carousel.Viewport>
						<Carousel.Content>
							{items.map(item => (
								<Carousel.Item
									key={item.id}
									className='basis-auto mr-5 0bg-surface p-4 rounded-sm'
								>
									<span className='h-full flex items-center gap-3'>
										<span
											className='inline-block max-w-52 h-10'
											style={{
												aspectRatio: `${item.image.lockup.size.width} / ${item.image.lockup.size.height}`,
											}}
										>
											<Image
												className='size-full object-contain'
												src={item.image.lockup.url}
												alt={item.name}
												width={item.image.lockup.size.width}
												height={item.image.lockup.size.height}
												loading='eager'
											/>
										</span>

										{item.image.lockup.label && (
											<span className='text-3xl font-semibold font-condensed tracking-tight whitespace-nowrap'>
												{item.name}
											</span>
										)}
									</span>
								</Carousel.Item>
							))}
						</Carousel.Content>
					</Carousel.Viewport>
				</Carousel.Root>
			</div>
		</div>
	)
}
