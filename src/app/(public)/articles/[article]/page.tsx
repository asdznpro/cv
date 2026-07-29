import { ViewTransition } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { getMarkdown, getMarkdownToc } from 'lib/server'
import { getImagePalette } from 'lib/utils'
import { ARTICLES_DATA } from 'shared/data'

import { ArticleToc, BackToTop } from 'widgets'
import { Badge, Button, PreviewCard, Separator } from 'ui/blocks'
import { MarkdownContent } from 'ui/markdown'
import {
	Icon20ArrowTurnRightOutline,
	Icon28ArrowLeftOutline,
	Icon28ChevronDownOutline,
	Icon28ChevronLeftCircle,
	Icon28CopyOutline,
} from '@vkontakte/icons'

export default async function Article({
	params,
}: {
	params: Promise<{ article: string }>
}) {
	const { article: slug } = await params

	const article = ARTICLES_DATA.find(item => item.slug === slug)

	const { content } = await getMarkdown('example')
	const toc = await getMarkdownToc(content)

	if (!article) {
		notFound()
	}

	const palette = await getImagePalette(article.image)

	return (
		<>
			<section className='-z-10 absolute top-0 w-full flex justify-center pointer-events-none overflow-hidden'>
				<span
					className='container w-full min-w-5xl h-[clamp(20rem,50vh,40rem)] animate-[fade-in_500ms_ease-out] pointer-events-none'
					style={{
						background: `radial-gradient(at 50% 0%, color-mix(in srgb, ${palette.vibrant} 40%, var(--color-background)) 0%, transparent 64%)`,
					}}
				/>
			</section>

			<span className='h-24' />

			<article className='mx-auto container w-full px-app flex flex-col items-center gap-x-app gap-y-12'>
				<section className='max-w-2xl w-full flex flex-col gap-12'>
					<header className='flex flex-col gap-6'>
						<nav className='text-xl font-medium font-condensed'>
							<Link href='/articles' className='text-foreground-secondary'>
								Articles
							</Link>{' '}
							<span className='text-foreground-secondary select-none'>/</span>{' '}
							<Link
								href={`/articles?category=${article.category?.slug}`}
								className=''
							>
								{article.category?.label}
							</Link>
						</nav>

						<div className='flex flex-1 flex-col gap-6'>
							<h1 className='text-5xl font-medium font-condensed tracking-tight text-balance'>
								{article.title}
							</h1>
						</div>

						{/* <div className='flex gap-app text-lg text-foreground-secondary font-condensed font-medium'>
							<span className='w-fit flex'>30 Jun 2026</span>
							<span className='w-fit flex'>4 min read</span>
							<span className='w-fit flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer'>
								Copy{' '}
								<Icon28ChevronLeftCircle
									className='-rotate-90'
									width={18}
									height={18}
								/>
							</span>
						</div> */}

						<div className='flex gap-1.5'>
							<Badge mode='outline' appearance='neutral'>
								{article.created_at}
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
					</header>
				</section>

				<section className='max-w-7xl w-full'>
					<ViewTransition
						name={`article-preview-${article.id}`}
						share='page-share'
						default='auto'
					>
						<PreviewCard
							ratio='4:1'
							src={article.image}
							alt={article.title}
							sizes='(max-width: 1240px) 100vw, 1240px'
							priority
						>
							<span className='z-1 absolute inset-0 mx-auto max-w-2xl w-full h-full'>
								{/* <span className='z-1 absolute top-0 left-0 w-full flex p-2 gap-1.5 uppercase'>
									<Badge size='md' radius='smooth'>
										Valorant
									</Badge>

									<Badge size='md' appearance='neutral' radius='smooth'>
										Esports
									</Badge>
								</span> */}

								{article.company && (
									<ViewTransition
										name={`article-preview-company-${article.id}`}
										share='page-share'
										default='auto'
									>
										<div className='z-1 absolute -bottom-6 right-0 w-32 h-32 flex items-center justify-center bg-surface border border-separator rounded-full overflow-hidden'>
											<Image
												className='w-full h-full object-cover'
												src={article.company.logo}
												alt={article.company.name}
												width={200}
												height={200}
											/>
										</div>
									</ViewTransition>
								)}
							</span>
						</PreviewCard>
					</ViewTransition>
				</section>

				<section className='max-w-7xl w-full grid grid-cols-[1fr_auto_1fr] gap-10'>
					<div className=''>
						<ArticleToc items={toc} />
					</div>

					<section className='max-w-2xl w-full flex flex-col gap-10'>
						<MarkdownContent>{content}</MarkdownContent>

						{/* <div className='flex gap-1.5'>
							{article.tags.map(tag => (
								<Badge
									key={tag}
									to={`/articles?tag=${tag}`}
									mode='outline'
									appearance='neutral'
								>
									#{tag}
								</Badge>
							))}
						</div> */}
					</section>

					{/* <div className=''>
						<div className='flex flex-col 0gap-2 text-lg text-foreground-secondary font-condensed font-medium'>
							<span className='w-fit flex'>30 Jun 2026</span>
							<span className='w-fit flex'>4 min read</span>
							<span className='w-fit flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer'>
								Copy{' '}
								<Icon28ChevronLeftCircle
									className='-rotate-90'
									width={18}
									height={18}
								/>
							</span>
						</div>
					</div> */}
				</section>

				<section className='max-w-2xl w-full flex flex-col gap-6'>
					<div className='flex flex-col border border-separator rounded-xl overflow-hidden'>
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

					<div className='flex gap-1.5'>
						{article.tags.map(tag => (
							<Badge
								key={tag}
								to={`/articles?tag=${tag}`}
								mode='outline'
								appearance='neutral'
							>
								#{tag}
							</Badge>
						))}
					</div>
				</section>

				<section className='sticky bottom-4 w-full flex justify-center gap-2'>
					{/* <Button
						to='/articles'
						size='lg'
						appearance='neutral'
						prefix={<Icon28ArrowLeftOutline width={20} height={20} />}
						radius='rounded'
					>
						Back to All Articles
					</Button> */}

					<BackToTop />
				</section>
			</article>

			<span />
		</>
	)
}
