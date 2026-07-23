'use client'

import { Hero } from 'widgets'
import {
	Badge,
	Button,
	FlickerSpinner,
	PreviewCard,
	Separator,
} from 'ui/blocks'

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
								<div className='sticky top-24'>
									<PreviewCard
										ratio='square'
										src={item.company.logo}
										alt={item.company.name}
										width={200}
										height={200}
										className='w-18 @2xl:w-24 0outline-2 outline-accent outline-offset-6'
										radius='full'
									/>
								</div>

								<span className='absolute inset-0 -z-1 w-full h-full flex items-center justify-center'>
									<Separator orientation='vertical' />
								</span>
							</aside>

							<div className='flex flex-1 flex-col pb-12 @2xl:pb-24 gap-app @2xl:gap-8'>
								<h3 className='text-3xl @2xl:text-5xl text-balance font-semibold font-condensed tracking-tight'>
									{item.company.name} <br />{' '}
									<span className='text-foreground-secondary'>{item.role}</span>
								</h3>

								<div className='flex flex-col bg-surface border border-separator rounded-xl'>
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

			{/* <section
				style={{ contentVisibility: 'auto', containIntrinsicSize: '640px' }}
				className='mx-auto container w-full flex flex-col px-app gap-8'
			>
				<FlickerSpinner className='mx-auto' size={48} />
			</section> */}

			{/* <section
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
			</section> */}

			{/* <span /> */}
		</>
	)
}
