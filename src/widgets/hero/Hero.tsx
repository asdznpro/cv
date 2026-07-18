'use client'

import Image from 'next/image'

import { Lanyard, PixelBlast } from 'widgets'
import { Carousel } from 'ui/blocks'

const TOOLKIT_LOGOS = [
	{
		image: '/assets/toolkit/figma.svg',
		name: 'Figma',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/adobe-cc.svg',
		name: 'Creative Cloud',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/adobe-ps.svg',
		name: 'Photoshop',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/adobe-ai.svg',
		name: 'Illustrator',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/adobe-ae.svg',
		name: 'After Effects',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/adobe-pr.svg',
		name: 'Premiere Pro',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/docker.svg',
		name: 'Docker',
		label: false,
		size: { width: 746, height: 180 },
	},
	{
		image: '/assets/toolkit/git.svg',
		name: 'Git',
		label: false,
		size: { width: 380, height: 180 },
	},
	{
		image: '/assets/toolkit/github.svg',
		name: 'GitHub',
		label: false,
		size: { width: 699, height: 200 },
	},
	{
		image: '/assets/toolkit/javascript.svg',
		name: 'JavaScript',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/typescript.svg',
		name: 'TypeScript',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/telegram.svg',
		name: 'Mini Apps',
		label: true,
		size: { width: 160, height: 160 },
	},
	{
		image: '/assets/toolkit/react.svg',
		name: 'React',
		label: true,
		size: { width: 178, height: 160 },
	},
	{
		image: '/assets/toolkit/vercel.svg',
		name: 'Vercel',
		label: false,
		size: { width: 800, height: 240 },
	},
	{
		image: '/assets/toolkit/next-js.svg',
		name: 'Next.js',
		label: false,
		size: { width: 794, height: 260 },
	},
	{
		image: '/assets/toolkit/nest-js.svg',
		name: 'Nest.js',
		label: true,
		size: { width: 155, height: 160 },
	},
	{
		image: '/assets/toolkit/node-js.svg',
		name: 'Node.js',
		label: true,
		size: { width: 142, height: 160 },
	},
	{
		image: '/assets/toolkit/tailwindcss.svg',
		name: 'Tailwind CSS',
		label: false,
		size: { width: 1270, height: 160 },
	},
	{
		image: '/assets/toolkit/redux-toolkit.svg',
		name: 'Redux Toolkit',
		label: true,
		size: { width: 169, height: 160 },
	},
	{
		image: '/assets/toolkit/vite.svg',
		name: 'Vite',
		label: false,
		size: { width: 928, height: 280 },
	},
	{
		image: '/assets/toolkit/storybook.svg',
		name: 'Storybook',
		label: false,
		size: { width: 800, height: 160 },
	},
	{
		image: '/assets/toolkit/motion.svg',
		name: 'Motion',
		label: false,
		size: { width: 450, height: 240 },
	},
	{
		image: '/assets/toolkit/prisma.svg',
		name: 'Prisma',
		label: false,
		size: { width: 531, height: 160 },
	},
	{
		image: '/assets/toolkit/tanstack.svg',
		name: 'Tanstack',
		label: true,
		size: { width: 160, height: 160 },
	},
]

export function Hero() {
	return (
		<div className='w-full h-screen flex flex-col p-2 gap-2'>
			<div className='relative z-0 w-full h-full rounded-xl border border-separator bg-blue-900 overflow-hidden'>
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
							{TOOLKIT_LOGOS.map((logo, index) => (
								<Carousel.Item
									key={index}
									className='basis-auto mr-5 0bg-surface p-4 rounded-sm'
								>
									<span className='h-full flex items-center gap-3'>
										<span
											className='inline-block max-w-52 h-10'
											style={{
												aspectRatio: `${logo.size.width} / ${logo.size.height}`,
											}}
										>
											<Image
												className='size-full object-contain'
												src={logo.image}
												alt={logo.name}
												width={logo.size.width}
												height={logo.size.height}
											/>
										</span>

										{logo.label && (
											<span className='text-3xl font-semibold font-condensed tracking-tight whitespace-nowrap'>
												{logo.name}
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
