'use client'

import React from 'react'

import { Button, Separator, Kbd, Badge } from 'ui/blocks'
import { FormItem } from 'ui/forms'
import {
	Icon28CalendarOutline,
	Icon28ChainOutline,
	Icon28ChevronDownOutline,
	Icon28CopyOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28MoreHorizontal,
	Icon28ViewOutline,
} from '@vkontakte/icons'

export default function Shortener() {
	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						URL Shortener
					</h1>

					<p className='text-foreground-secondary text-balance'>
						Create short links to your website or social media profiles
					</p>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Original URL
							</h3>

							<p className='text-sm text-foreground-secondary'>
								The original URL you want to shorten
							</p>
						</div>

						<div className='w-2/5'>
							<FormItem id='coupon-code'>
								<FormItem.Input
									size='md'
									mode='outline'
									type='text'
									placeholder='go.asdzn.pro/example'
									prefix={<Icon28ChainOutline width={18} height={18} />}
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Slug{' '}
								<span className='text-foreground-secondary'>(optional)</span>
							</h3>

							<p className='text-sm text-foreground-secondary'>
								You can optionally provide a custom slug for your shortened
								link. If you don't provide a slug, we will generate a random one
								for you.
							</p>
						</div>

						<div className='w-2/5'>
							<FormItem id='coupon-code'>
								<FormItem.Input
									size='md'
									mode='outline'
									type='text'
									placeholder='example'
									prefix={<Icon28HashtagOutline width={18} height={18} />}
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Choose domain
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Choose the domain for your shortened link
							</p>
						</div>

						<div className='w-2/5'>
							<FormItem id='coupon-code'>
								<FormItem.Input
									size='md'
									mode='outline'
									type='text'
									value='go.asdzn.pro'
									prefix={<Icon28GlobeOutline width={18} height={18} />}
									suffix={<Icon28ChevronDownOutline width={18} height={18} />}
									readOnly
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex items-center p-surface gap-surface'>
						<div className='ml-auto w-2/5 flex gap-2'>
							<Button
								className='flex-1'
								type='button'
								mode='secondary'
								appearance='neutral'
							>
								Reset
							</Button>

							<Button className='flex-1' type='submit'>
								Shorten
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Shortened Links
						</h2>

						<p className='text-sm text-foreground-secondary'>
							Manage your short links and their statistics
						</p>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					{[...Array(7)].map((_, index) => (
						<React.Fragment key={index}>
							<div className='flex items-center p-surface gap-surface'>
								<div className='flex flex-1 flex-col gap-3'>
									<a
										href='https://go.asdzn.pro/example'
										target='_blank'
										rel='noopener noreferrer'
										className='root w-fit text-xl font-medium font-condensed tracking-tight hover:underline hover:text-link transition-colors'
									>
										go.asdzn.pro/example
									</a>

									<span className='flex flex-wrap gap-1'>
										<Badge
											size='md'
											mode='soft'
											appearance='neutral'
											prefix={<Icon28ViewOutline width={14} height={14} />}
										>
											15
										</Badge>

										<Badge
											size='md'
											mode='soft'
											appearance='neutral'
											prefix={<Icon28CalendarOutline width={14} height={14} />}
										>
											2026-07-21
										</Badge>

										<Badge
											className='max-w-52'
											size='md'
											mode='soft'
											appearance='neutral'
											prefix={<Icon28ChainOutline width={14} height={14} />}
										>
											https://disk.yandex.ru/i/vSCGnYP10Tw7Og sodijf lsjlds
											jdjdflfdsjlkfsdjfdslk
										</Badge>
									</span>
								</div>

								<div className='flex gap-2'>
									<Button
										mode='soft'
										appearance='neutral'
										prefix={<Icon28CopyOutline width={18} height={18} />}
										iconOnly
									/>

									<Button
										mode='ghost'
										appearance='neutral'
										prefix={<Icon28MoreHorizontal width={18} height={18} />}
										iconOnly
									/>
								</div>
							</div>

							{index !== 6 && <Separator />}
						</React.Fragment>
					))}
				</div>
			</section>

			<span />
		</>
	)
}
