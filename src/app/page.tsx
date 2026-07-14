'use client'

import { Lanyard, PixelBlast } from 'widgets'
import { Carousel } from 'ui/blocks'

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

				<div className='relative z-0 w-full flex p-2 rounded-xl border border-separator bg-background overflow-hidden shrink-0'>
					<Carousel.Root
						options={{
							align: 'center',
							// containScroll: 'keepSnaps',
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
							<Carousel.Content className='0gap-app mr-2'>
								{[...Array(24)].map((_, index) => (
									<Carousel.Item
										key={index}
										className='basis-auto mr-2 bg-surface p-4 rounded-sm'
									>
										<span className=''>Logotype {index}</span>
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
