'use client'

import { ViewTransition } from 'react'

import { NewsItem } from 'widgets'
import { Badge, Button } from 'ui/blocks'
import {
	Icon24ExternalLinkOutline,
	Icon28CopyOutline,
	Icon28Play,
} from '@vkontakte/icons'

import { BLOG_POSTS } from 'shared/data'

export default function Blog() {
	return (
		<>
			<span className='h-24' />

			<section className='mx-auto max-w-container w-full flex flex-col px-app gap-10'>
				<div className='flex gap-app'>
					<div className='flex flex-1 flex-col gap-3'>
						<h1 className='text-5xl font-semibold font-condensed tracking-tight uppercase'>
							Blog
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

				<div className='grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-x-app gap-y-8'>
					{BLOG_POSTS.map(item => (
						<NewsItem
							key={item.id}
							{...(item.external_link
								? { href: item.external_link, target: '_blank' }
								: { to: `/blog/${item.id}` })}
						>
							<ViewTransition
								name={`article-preview-${item.id}`}
								share='page-share'
								default='auto'
							>
								<NewsItem.Preview src={item.image} alt={item.title}>
									<span className='z-1 absolute top-0 left-0 w-full flex p-2 gap-1.5 uppercase'>
										<Badge size='md' radius='smooth'>
											Valorant
										</Badge>

										<Badge size='md' appearance='neutral' radius='smooth'>
											Esports
										</Badge>

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
											className='z-1 absolute'
											appearance='neutral'
											prefix={<Icon28Play width={18} height={18} />}
											radius='rounded'
											iconOnly
										/>
									)}
								</NewsItem.Preview>
							</ViewTransition>

							<NewsItem.Info
								meta='12 days ago'
								title={item.title}
								subtitle={item.description}
							/>
						</NewsItem>
					))}
				</div>
			</section>

			<span />
		</>
	)
}
