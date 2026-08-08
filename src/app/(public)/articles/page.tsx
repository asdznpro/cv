'use client'

import Image from 'next/image'
import { ViewTransition } from 'react'

import { ArticleItem } from 'widgets/content'

import { Badge, Button } from 'ui/blocks'
import {
	Icon24ExternalLinkOutline,
	Icon28CopyOutline,
	Icon28Play,
} from '@vkontakte/icons'

import { ARTICLES_DATA } from 'shared/data'

export default function Articles() {
	return (
		<>
			<span className='h-24' />

			<section className='mx-auto max-w-4xl w-full flex flex-col px-app gap-20'>
				<div className='flex gap-app'>
					<div className='flex flex-1 flex-col gap-3'>
						<h1 className='text-5xl font-semibold font-condensed tracking-tight uppercase'>
							Articles
						</h1>
					</div>

					<Button
						mode='soft'
						appearance='neutral'
						prefix={<Icon28CopyOutline width={18} height={18} />}
						radius='rounded'
						iconOnly
					/>
				</div>

				<div className='flex flex-col gap-10'>
					{ARTICLES_DATA.sort((a, b) => b.priority - a.priority).map(item => (
						<ArticleItem
							key={item.id}
							{...(item.external_link
								? { href: item.external_link, target: '_blank' }
								: { to: `/articles/${item.slug}` })}
						>
							<ViewTransition
								name={`article-preview-${item.id}`}
								share='page-share'
								default='auto'
							>
								<ArticleItem.Preview src={item.image} alt={item.title}>
									<span className='z-1 absolute top-0 left-0 w-full flex p-2 gap-1.5 uppercase'>
										{/* <Badge size='md' radius='smooth'>
											Valorant
										</Badge>

										<Badge size='md' appearance='neutral' radius='smooth'>
											Esports
										</Badge> */}

										{item.external_link && (
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

									{item.external_link && (
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
								meta={[item.created_at, item.category?.label]}
								title={item.title}
								subtitle={item.description}
							/>
						</ArticleItem>
					))}
				</div>
			</section>

			<span />
		</>
	)
}
