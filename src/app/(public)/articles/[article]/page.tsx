import { ViewTransition } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { after } from 'next/server'
import { notFound } from 'next/navigation'

import {
	getArticleBySlug,
	listRelatedArticles,
	type Article,
} from 'lib/articles'
import { getVisitorHash, recordArticleView } from 'lib/articles/server'
import { getImagePalette, getMarkdownToc } from 'lib/server'
import { getFormattedDate } from 'lib/utils'

import { ArticleCopyMenu, ArticleToc } from 'widgets/content'
import { BackToTop } from 'widgets/shell'

import { Badge, PreviewCard, Separator } from 'ui/blocks'
import { MarkdownContent } from 'ui/markdown'
import { Icon20ArrowTurnRightOutline } from '@vkontakte/icons'

function formatCategory(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1)
}

function estimateReadMinutes(content: string) {
	const words = content.trim().split(/\s+/).filter(Boolean).length
	return Math.max(1, Math.ceil(words / 200))
}

function articleHref(item: Article) {
	if (item.type === 'link' && item.external_url) return item.external_url
	if (item.slug) return `/articles/${item.slug}`
	return null
}

export default async function ArticlePage({
	params,
}: {
	params: Promise<{ article: string }>
}) {
	const { article: slug } = await params
	const article = await getArticleBySlug(slug)

	if (!article) notFound()

	if (article.status === 'published') {
		const visitorHash = await getVisitorHash()
		after(() => {
			void recordArticleView(article.id, visitorHash)
		})
	}

	const content = article.content
	const [toc, related, palette] = await Promise.all([
		getMarkdownToc(content),
		listRelatedArticles(article),
		getImagePalette(article.cover_url ?? ''),
	])

	const categoryLabel = formatCategory(article.category)
	const readMinutes = estimateReadMinutes(content)

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
							<Link href={`/articles?category=${article.category}`}>
								{categoryLabel}
							</Link>
						</nav>

						<div className='flex flex-1 flex-col gap-6'>
							<h1 className='text-5xl font-medium font-condensed tracking-tight text-balance'>
								{article.title}
							</h1>
						</div>

						<div className='flex flex-wrap gap-1.5'>
							{article.status !== 'published' && (
								<Badge mode='outline' appearance='neutral'>
									{article.status === 'draft' ? 'Draft' : 'Archived'}
								</Badge>
							)}

							<Badge mode='outline' appearance='neutral'>
								{getFormattedDate(article.created_at, false).full}
							</Badge>

							<Badge mode='outline' appearance='neutral'>
								{readMinutes} min read
							</Badge>

							<ArticleCopyMenu markdown={content} />
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
							src={article.cover_url ?? undefined}
							alt={article.title}
							sizes='(max-width: 1240px) 100vw, 1240px'
							priority
						>
							<span className='z-1 absolute inset-0 mx-auto max-w-2xl w-full h-full'>
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

				<section className='max-w-7xl w-full flex flex-col @3xl:grid grid-cols-[1fr_auto_1fr] gap-10'>
					<div className='max-w-2xl'>
						<ArticleToc items={toc} />
					</div>

					<section className='max-w-2xl w-full flex flex-col gap-10'>
						<MarkdownContent>{content}</MarkdownContent>
					</section>
				</section>

				<section className='max-w-2xl w-full flex flex-col gap-6'>
					{related.length > 0 && (
						<div className='flex flex-col border border-separator rounded-xl overflow-hidden'>
							<div className='flex flex-col p-surface gap-surface bg-surface'>
								<span className='text-foreground-secondary font-medium'>
									Возможно, вам будет интересно
								</span>
							</div>

							<Separator />

							<div className='flex flex-col p-surface gap-surface'>
								{related.map(item => {
									const href = articleHref(item)
									if (!href) return null

									const isExternal = item.type === 'link'

									return (
										<Link
											key={item.id}
											href={href}
											target={isExternal ? '_blank' : undefined}
											rel={isExternal ? 'noopener noreferrer' : undefined}
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
												{item.title}
											</span>

											<span className='-z-1 absolute -inset-2 rounded bg-surface-secondary opacity-0 group-focus-visible:opacity-100 transition-opacity' />
										</Link>
									)
								})}
							</div>
						</div>
					)}

					{article.tags.length > 0 && (
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
					)}
				</section>

				<section className='sticky bottom-4 w-full flex justify-center gap-2'>
					<BackToTop />
				</section>
			</article>

			<span />
		</>
	)
}
