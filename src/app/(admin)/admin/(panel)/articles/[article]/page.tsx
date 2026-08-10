'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { getMarkdown } from 'lib/server'

import { ARTICLES_DATA } from 'shared/data'

import {
	Badge,
	Button,
	Kbd,
	PreviewCard,
	Separator,
	Tabs,
	useTabState,
} from 'ui/blocks'
import { FormItem } from 'ui/forms'
import { Tooltip } from 'ui/floating'
import { MarkdownContent } from 'ui/markdown'

import {
	Icon20ArrowTurnRightOutline,
	Icon28AddOutline,
	Icon28ArrowLeftOutline,
	Icon28ChevronDownOutline,
	Icon28DocumentTextOutline,
} from '@vkontakte/icons'

export default async function Article({
	params,
}: {
	params: Promise<{ article: string }>
}) {
	// const { article: slug } = await params

	const { tabState, handleTabSelect } = useTabState(0)

	// const article = ARTICLES_DATA.find(item => item.slug === slug)

	// const { content } = await getMarkdown('example')

	// if (!article) {
	// 	notFound()
	// }

	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							General
						</h2>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Cover
							</h3>

							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Hero image for the article preview. Optionally attach an entity
								badge, like a company logo.
							</p>
						</div>

						<div className='w-full @xl:w-2/5'>
							<div className='z-0 relative flex'>
								<button className='aspect-4/1 w-full flex items-center justify-center text-foreground-secondary bg-background hover:bg-surface-secondary border border-dashed border-separator rounded-md overflow-hidden cursor-pointer transition-colors focus-ring-base focus-ring-visible'>
									<Icon28AddOutline width={16} height={16} />
								</button>

								<button className='z-1 absolute -bottom-2 right-4 size-12 flex items-center justify-center text-foreground-secondary bg-background hover:bg-surface-secondary border border-dashed border-separator rounded-full overflow-hidden cursor-pointer transition-colors focus-ring-base focus-ring-visible'>
									<Icon28AddOutline width={16} height={16} />
								</button>
							</div>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Details
							</h3>

							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Headline and short summary used in lists, cards, and the article
								header.
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='article-title'>
								<FormItem.Input
									mode='outline'
									size='md'
									type='text'
									placeholder='Title'
								/>
							</FormItem>

							<FormItem id='article-title'>
								<FormItem.Input
									mode='outline'
									size='md'
									type='text'
									placeholder='Slug'
								/>
							</FormItem>

							<FormItem id='article-description'>
								<FormItem.Textarea
									mode='outline'
									size='md'
									placeholder='Description'
									resize='none'
									rows={3}
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Classification
							</h3>

							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Pick one category for navigation. Add tags for topics and
								related articles.
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='article-category'>
								<FormItem.Input
									mode='outline'
									size='md'
									type='text'
									placeholder='Category'
									suffix={<Icon28ChevronDownOutline width={18} height={18} />}
								/>
							</FormItem>

							<FormItem id='article-tags'>
								<FormItem.Input
									mode='outline'
									size='md'
									type='text'
									placeholder='Tags'
									suffix={<Icon28ChevronDownOutline width={18} height={18} />}
								/>
							</FormItem>
						</div>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Content
						</h2>
					</div>
				</div>

				<div className='flex flex-col border border-separator rounded-surface overflow-hidden'>
					<div className='flex flex-col bg-surface'>
						<div className='h-12 flex items-center px-surface gap-surface'>
							<Tabs
								className='border-none'
								initialIndex={tabState}
								onTabSelect={handleTabSelect}
							>
								<Tabs.Item>Edit</Tabs.Item>
								<Tabs.Item>Preview</Tabs.Item>
							</Tabs>

							<Button
								type='button'
								size='sm'
								mode='soft'
								appearance='neutral'
								prefix={<Icon28DocumentTextOutline width={16} height={16} />}
							>
								Copy Markdown
							</Button>
						</div>
					</div>

					<Separator />

					<div className='flex'>
						<textarea
							className='w-full p-surface resize-none appearance-none outline-none text-xs font-mono placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary'
							placeholder='Write your article here...'
							rows={16}
						/>
					</div>

					<Separator />

					<div className='h-12 flex items-center p-surface gap-surface bg-surface'>
						<span className='text-xs text-foreground-secondary'>
							85 stroke, column 16
						</span>

						<Separator orientation='vertical' />

						<span className='text-xs text-foreground-secondary'>
							4 443 characters
						</span>

						<span className='flex-1' />

						<span className='flex items-center gap-2'>
							<Kbd size='sm' keys={['Esc']} />
							<span className='text-xs text-foreground-secondary'>
								to close
							</span>
						</span>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Related articles
						</h2>
					</div>
				</div>

				<div className='flex flex-col border border-separator rounded-surface overflow-hidden'>
					<div className='flex flex-col p-surface gap-surface bg-surface'>
						<span className='text-foreground-secondary text-sm font-medium'>
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
								className='group relative flex gap-2 transition-all hover:underline underline-offset-4 outline-none'
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
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className='sticky bottom-app mx-auto max-w-md w-full flex flex-col px-app gap-app'>
				<div className='flex flex-col bg-background border border-separator rounded-full overflow-hidden'>
					<div className='flex items-center p-2 gap-2'>
						<Tooltip text='Back to articles'>
							<Button
								to='/admin/articles'
								mode='ghost'
								appearance='neutral'
								radius='rounded'
								prefix={<Icon28ArrowLeftOutline width={18} height={18} />}
								iconOnly
							/>
						</Tooltip>

						<Button
							type='button'
							mode='secondary'
							appearance='neutral'
							radius='rounded'
						>
							Discard changes
						</Button>

						<span className='flex-1' />

						<Button
							type='button'
							mode='ghost'
							appearance='neutral'
							radius='rounded'
						>
							Save draft
						</Button>

						<Button type='submit' radius='rounded'>
							Publish
						</Button>
					</div>
				</div>
			</section>

			<span />
		</>
	)
}
