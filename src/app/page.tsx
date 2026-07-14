'use client'

import Image from 'next/image'

import { Lanyard, PixelBlast } from 'widgets'
import { Carousel } from 'ui/blocks'

const TOOLKIT_LOGOS = [
	{
		image: '/assets/toolkit/figma.svg',
		name: 'Figma',
		label: true,
	},
	{
		image: '/assets/toolkit/adobe-cc.svg',
		name: 'Creative Cloud',
		label: true,
	},
	{
		image: '/assets/toolkit/adobe-ps.svg',
		name: 'Photoshop',
		label: true,
	},
	{
		image: '/assets/toolkit/adobe-ai.svg',
		name: 'Illustrator',
		label: true,
	},
	{
		image: '/assets/toolkit/adobe-ae.svg',
		name: 'After Effects',
		label: true,
	},
	{
		image: '/assets/toolkit/adobe-pr.svg',
		name: 'Premiere Pro',
		label: true,
	},
	{
		image: '/assets/toolkit/docker.svg',
		name: 'Docker',
		label: false,
	},
	{
		image: '/assets/toolkit/git.svg',
		name: 'Git',
		label: false,
	},
	{
		image: '/assets/toolkit/github.svg',
		name: 'GitHub',
		label: false,
	},
	{
		image: '/assets/toolkit/javascript.svg',
		name: 'JavaScript',
		label: true,
	},
	{
		image: '/assets/toolkit/typescript.svg',
		name: 'TypeScript',
		label: true,
	},
	{
		image: '/assets/toolkit/telegram.svg',
		name: 'Telegram Mini Apps',
		label: true,
	},
	{
		image: '/assets/toolkit/react.svg',
		name: 'React',
		label: true,
	},
	{
		image: '/assets/toolkit/vercel.svg',
		name: 'Vercel',
		label: false,
	},
	{
		image: '/assets/toolkit/next-js.svg',
		name: 'Next.js',
		label: false,
	},
	{
		image: '/assets/toolkit/nest-js.svg',
		name: 'Nest.js',
		label: true,
	},
	{
		image: '/assets/toolkit/node-js.svg',
		name: 'Node.js',
		label: true,
	},
	{
		image: '/assets/toolkit/tailwindcss.svg',
		name: 'Tailwind CSS',
		label: false,
	},
	{
		image: '/assets/toolkit/redux-toolkit.svg',
		name: 'Redux Toolkit',
		label: true,
	},

	{
		image: '/assets/toolkit/vite.svg',
		name: 'Vite',
		label: false,
	},
	{
		image: '/assets/toolkit/storybook.svg',
		name: 'Storybook',
		label: false,
	},
	{
		image: '/assets/toolkit/motion.svg',
		name: 'Motion',
		label: false,
	},
]

export default function Home() {
	return (
		<>
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
											<Image
												className='max-w-48 w-full max-h-10 h-full object-contain'
												src={logo.image}
												alt={logo.name}
												width={100}
												height={100}
											/>

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

			<section
				style={{ contentVisibility: 'auto', containIntrinsicSize: '640px' }}
				className='mx-auto container w-full flex flex-col px-app gap-8'
			>
				<div className='flex flex-col gap-6'>
					<h1 className='text-3xl font-semibold font-condensed tracking-tight'>
						To get started, edit the page.tsx file.
					</h1>

					<p className='text-lg text-foreground-secondary'>
						Looking for a starting point or more instructions? Head over to{' '}
						<a
							target='_blank'
							href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-foreground hover:text-accent underline'
						>
							Templates
						</a>{' '}
						or the{' '}
						<a
							target='_blank'
							href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-foreground hover:text-accent underline'
						>
							Learning
						</a>{' '}
						center.
					</p>

					<p className='text-sm text-foreground-tertiary font-condensed uppercase tracking-tight'>
						Продолжая использовать{' '}
						<a
							target='_blank'
							href='/'
							className='text-foreground-secondary hover:text-foreground underline'
						>
							Lowtab.gg
						</a>
						, вы принимаете условия нашей{' '}
						<a
							href='/'
							className='text-foreground-secondary hover:text-foreground underline'
						>
							Политики конфиденциальности
						</a>
						{' и '}
						<a
							href='/'
							className='text-foreground-secondary hover:text-foreground underline'
						>
							Правил сервиса
						</a>
						, а также соглашаетесь на{' '}
						<a
							href='/'
							className='text-foreground-secondary hover:text-foreground underline'
						>
							обработку персональных данных
						</a>
						, применение{' '}
						<a
							href='/'
							className='text-foreground-secondary hover:text-foreground underline'
						>
							файлов cookie
						</a>
						, средств аналитики и рекомендательных механизмов, необходимых для
						корректной работы платформы, повышения удобства использования и
						персонализации вашего пользовательского опыта.
					</p>
				</div>
			</section>

			<span />
		</>
	)
}
