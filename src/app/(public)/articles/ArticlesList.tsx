'use client'

import Image from 'next/image'
import { ViewTransition } from 'react'

import type { Article } from 'lib/articles'
import { trackArticleEngagement } from 'lib/articles/track-view-action'
import { getFormattedDate } from 'lib/utils'

import { ArticleItem } from 'widgets/content'
import { EmptyStateScreen } from 'widgets/shell'

import { Badge, Button } from 'ui/blocks'
import { Icon24ExternalLinkOutline, Icon28Play } from '@vkontakte/icons'

function formatCategory(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1)
}

function statusLabel(status: Article['status']) {
	switch (status) {
		case 'draft':
			return 'Draft'
		case 'archived':
			return 'Archived'
		default:
			return null
	}
}

type ArticlesListProps = {
	articles: Article[]
	showStatus?: boolean
}

export function ArticlesList({
	articles,
	showStatus = false,
}: ArticlesListProps) {
	if (articles.length === 0) {
		return <EmptyStateScreen />
	}

	return (
		<div className='flex flex-col gap-10'>
			{articles.map(item => {
				const externalUrl = item.type === 'link' ? item.external_url : null
				const hrefProps = externalUrl
					? { href: externalUrl, target: '_blank' as const }
					: item.slug
						? { to: `/articles/${item.slug}` }
						: {}
				const status = showStatus ? statusLabel(item.status) : null

				return (
					<ArticleItem
						key={item.id}
						{...hrefProps}
						onClick={
							externalUrl
								? () => {
										void trackArticleEngagement(item.id)
									}
								: undefined
						}
					>
						<ViewTransition
							name={`article-preview-${item.id}`}
							share='page-share'
							default='auto'
						>
							<ArticleItem.Preview
								src={item.cover_url ?? undefined}
								alt={item.title}
							>
								<span className='z-1 absolute top-0 left-0 w-full flex p-2 gap-1.5 uppercase'>
									{status && (
										<Badge size='md' mode='secondary' appearance='neutral'>
											{status}
										</Badge>
									)}

									{externalUrl && (
										<Badge
											className='ml-auto'
											size='md'
											mode='secondary'
											appearance='neutral'
											prefix={
												<Icon24ExternalLinkOutline width={14} height={14} />
											}
										/>
									)}
								</span>

								{externalUrl && (
									<Button
										as='span'
										className='z-1 absolute inset-0'
										appearance='neutral'
										prefix={<Icon28Play width={18} height={18} />}
										radius='rounded'
										iconOnly
									/>
								)}

								{item.company && (
									<ViewTransition
										name={`article-preview-company-${item.id}`}
										share='page-share'
										default='auto'
									>
										<div className='z-1 absolute -bottom-6 right-6 w-24 h-24 flex items-center justify-center bg-surface border border-separator rounded-full overflow-hidden'>
											<Image
												className='w-full h-full object-cover'
												src={item.company.logo}
												alt={item.company.name}
												width={200}
												height={200}
											/>
										</div>
									</ViewTransition>
								)}
							</ArticleItem.Preview>
						</ViewTransition>

						<ArticleItem.Info
							meta={[
								getFormattedDate(item.created_at, false).relative,
								formatCategory(item.category),
							]}
							title={item.title}
							subtitle={item.description}
						/>
					</ArticleItem>
				)
			})}
		</div>
	)
}
