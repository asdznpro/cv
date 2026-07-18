import { ViewTransition } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { getMarkdown } from 'lib/server'
import { BLOG_POSTS } from 'shared/data'

import { Badge, Button, PreviewCard, Separator } from 'ui/blocks'
import { MarkdownContent } from 'ui/markdown'
import {
	Icon20ArrowTurnRightOutline,
	Icon28ArrowLeftOutline,
	Icon28ChevronDownOutline,
	Icon28CopyOutline,
} from '@vkontakte/icons'

export default async function Article({
	params,
}: {
	params: Promise<{ article: string }>
}) {
	const { article: slug } = await params

	const article = BLOG_POSTS.find(item => item.id === parseInt(slug))

	const { content } = await getMarkdown('example')

	if (!article) {
		notFound()
	}

	return (
		<>
			<span className='h-24' />

			<section className='-z-10 absolute top-0 w-full flex justify-center pointer-events-none overflow-hidden'>
				<span className='container w-full min-w-5xl h-80 bg-radial-[at_50%_0%] from-blue-600 to-transparent to-64% animate-[fade-in_500ms_ease-out] pointer-events-none' />
			</section>

			<article className='mx-auto container w-full grid grid-cols-12 px-app gap-x-app gap-y-20'>
				<section className='col-span-full @xl:col-span-6 col-start-1 @xl:col-start-4 w-full flex flex-col gap-10'>
					{/* <div className='flex gap-app'>
						<Button
							to='/news'
							mode='soft'
							appearance='neutral'
							prefix={<Icon28ArrowLeftOutline width={18} height={18} />}
							radius='rounded'
							iconOnly
						/>

						<div className='flex flex-1 flex-col gap-3'>
							<h2 className='text-3xl font-semibold font-condensed tracking-tight uppercase'>
								{article.title}
							</h2>

							{article.description && (
								<p className='text-sm text-foreground-secondary'>
									{article.description}
								</p>
							)}
						</div>

						<Button
							mode='soft'
							appearance='neutral'
							prefix={<Icon28CopyOutline width={18} height={18} />}
							radius='rounded'
							iconOnly
						/>
					</div> */}

					<header className='flex flex-col gap-6'>
						<div className='flex gap-1.5'>
							<Badge mode='outline' appearance='neutral'>
								30 Jun 2026
							</Badge>

							<Badge mode='outline' appearance='neutral'>
								4 min read
							</Badge>

							<Badge
								mode='outline'
								appearance='neutral'
								suffix={<Icon28ChevronDownOutline width={16} height={16} />}
							>
								Copy
							</Badge>
						</div>

						<div className='flex flex-1 flex-col gap-6'>
							<h2 className='text-5xl font-semibold font-condensed tracking-tight text-balance'>
								{article.title}
							</h2>

							{article.description && (
								<p className='text-sm text-foreground-secondary'>
									{article.description}
								</p>
							)}
						</div>
					</header>
				</section>

				<section className='col-span-full @xl:col-span-8 col-start-1 @xl:col-start-3 w-full'>
					<ViewTransition
						name={`article-preview-${article.id}`}
						share='page-share'
						default='auto'
					>
						<PreviewCard
							ratio='2:1'
							src={article.image}
							alt={article.title}
							sizes='(max-width: 896px) 100vw, 896px'
							priority
						>
							<span className='z-1 absolute top-0 left-0 w-full flex p-2 gap-1.5 uppercase'>
								<Badge size='md' radius='smooth'>
									Valorant
								</Badge>

								<Badge size='md' appearance='neutral' radius='smooth'>
									Esports
								</Badge>
							</span>
						</PreviewCard>
					</ViewTransition>
				</section>

				<section className='col-span-full @xl:col-span-6 col-start-1 @xl:col-start-4 w-full flex flex-col gap-10'>
					<MarkdownContent>{content}</MarkdownContent>
				</section>

				<section className='col-span-full @xl:col-span-6 col-start-1 @xl:col-start-4 w-full flex flex-col gap-10'>
					<div className='flex gap-1.5'>
						<Badge mode='outline' appearance='neutral'>
							#valorant
						</Badge>

						<Badge mode='outline' appearance='neutral'>
							#esports
						</Badge>

						<Badge mode='outline' appearance='neutral'>
							#vct
						</Badge>
					</div>

					<div className='flex flex-col border border-separator rounded-lg overflow-hidden'>
						<div className='flex flex-col p-surface gap-surface bg-surface'>
							<span className='text-foreground-secondary font-medium'>
								Возможно, вам будет интересно
							</span>
						</div>

						<Separator />

						<div className='flex flex-col p-surface gap-surface'>
							{[
								'Что такое Apache Kafka: как устроен и работает брокер											сообщений',
								'Apache Kafka: разбираемся в технологии в теории и на практике',
								'Как работать с темами в Kafka',
							].map(item => (
								<Link
									key={item}
									href='/news/article-1'
									className='group relative flex gap-3 transition-all hover:underline underline-offset-4 outline-none'
								>
									<Badge
										mode='ghost'
										appearance='neutral'
										prefix={
											<Icon20ArrowTurnRightOutline width={18} height={18} />
										}
										radius='smooth'
									/>

									<span className='text-xl font-semibold font-condensed tracking-tight'>
										{item}
									</span>

									<span className='-z-1 absolute -inset-2 rounded bg-surface-secondary opacity-0 group-focus-visible:opacity-100 transition-opacity' />
								</Link>
							))}
						</div>
					</div>
				</section>

				<section className='sticky bottom-4 col-span-full w-full flex justify-center'>
					<Button
						to='/blog'
						size='lg'
						// mode='soft'
						appearance='neutral'
						prefix={<Icon28ArrowLeftOutline width={20} height={20} />}
						radius='rounded'
					>
						Back to All News
					</Button>
				</section>
			</article>

			<span />
		</>
	)
}
