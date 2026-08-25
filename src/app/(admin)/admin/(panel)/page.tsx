'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Button, Separator } from 'ui/blocks'
import { PixelBlast } from 'ui/effects'
import { ContextCard, Tooltip } from 'ui/floating'
import { FormItem } from 'ui/forms'

import { Icon28HelpOutline } from '@vkontakte/icons'

const STATUS_OPTIONS = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'published', label: 'Published' },
	{ value: 'archived', label: 'Archived' },
]

const CATEGORY_OPTIONS = [
	{ value: 'experience', label: 'Experience' },
	{ value: 'other', label: 'Other' },
]

const COMPANY_OPTIONS = [
	{ value: 'vp', label: 'Virtus.pro' },
	{ value: 'nsa', label: 'No Sleep Agency' },
	{ value: 'team-spirit', label: 'Team Spirit' },
	{ value: 'navi', label: 'Natus Vincere' },
]

const TAG_OPTIONS = [
	{ value: 'cs2', label: 'CS2' },
	{ value: 'dota2', label: 'Dota 2' },
	{ value: 'esports', label: 'Esports' },
	{ value: 'design', label: 'Design' },
	{ value: 'frontend', label: 'Frontend' },
	{ value: 'backend', label: 'Backend' },
	{ value: 'database', label: 'Database' },
	{ value: 'devops', label: 'DevOps' },
	{ value: 'security', label: 'Security' },
	{ value: 'testing', label: 'Testing' },
	{ value: 'performance', label: 'Performance' },
	{ value: 'ux', label: 'UX' },
	{ value: 'ui', label: 'UI' },
]

export default function Admin() {
	const [status, setStatus] = useState('draft')
	const [category, setCategory] = useState('')
	const [company, setCompany] = useState('')
	const [tags, setTags] = useState<string[]>(['cs2'])

	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						Overview
					</h1>

					<p className='text-foreground-secondary text-balance'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
						quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
					</p>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-col p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Redeem coupon
							</h3>

							<p className='text-sm text-foreground-secondary'>
								If your hardware supports this feature we we automatically lay
								of the processing to the hardware. Otherwise our built in
								software algorithm is used.
							</p>
						</div>

						<FormItem id='coupon-code' required>
							<FormItem.Label
								suffix={
									<Tooltip
										align='end'
										text='Why this exists — scope, limits, or constraints'
									>
										<Icon28HelpOutline width={20} height={20} />
									</Tooltip>
								}
							>
								Coupon Code
							</FormItem.Label>

							<FormItem.Input
								type='text'
								placeholder='Enter coupon code'
								suffix={
									<Button size='sm' mode='secondary' appearance='neutral'>
										Apply Code
									</Button>
								}
							/>

							<FormItem.Caption>This is an error</FormItem.Caption>
						</FormItem>

						<FormItem id='description' optional>
							<FormItem.Label>Description</FormItem.Label>

							<FormItem.Textarea
								placeholder='Enter description'
								rows={3}
								maxLength={100}
								resize='none'
							/>

							<FormItem.Caption
								prefix={<Icon28HelpOutline width={20} height={20} />}
							>
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								Quisquam, quos. Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Quisquam, quos.
							</FormItem.Caption>
						</FormItem>

						<FormItem id='select-status' required>
							<FormItem.Label>Status</FormItem.Label>

							<FormItem.Select
								options={STATUS_OPTIONS}
								value={status}
								onValueChange={setStatus}
								placeholder='Select status'
							/>

							<FormItem.Caption>Selected: {status || 'none'}</FormItem.Caption>
						</FormItem>

						<FormItem id='combobox-company'>
							<FormItem.Label>Company</FormItem.Label>

							<FormItem.Combobox
								options={COMPANY_OPTIONS}
								value={company}
								onValueChange={setCompany}
								placeholder='Search company'
							/>

							<FormItem.Caption>Selected: {company || 'none'}</FormItem.Caption>
						</FormItem>

						<FormItem id='autocomplete-tags'>
							<FormItem.Label>Tags</FormItem.Label>

							<FormItem.Autocomplete
								options={TAG_OPTIONS}
								value={tags}
								onValueChange={setTags}
								placeholder='Add tags'
							/>

							<FormItem.Caption>
								Selected: {tags.length ? tags.join(', ') : 'none'}
							</FormItem.Caption>
						</FormItem>
					</div>

					<Separator />

					<div className='flex flex-col p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Hardware / Software echo cancellation
							</h3>

							<p className='text-sm text-foreground-secondary'>
								If your hardware supports this feature we we automatically lay
								of the processing to the hardware. Otherwise our built in
								software algorithm is used.
							</p>
						</div>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Gift a Lowtab.gg Subscription
							</h3>
							<p className='text-sm text-foreground-secondary'>
								If your hardware supports this feature we we automatically lay
								of the processing to the hardware. Otherwise our built in
								software algorithm is used.
							</p>
						</div>

						<Button>Gift Subscription</Button>
					</div>
				</div>
			</section>

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex flex-wrap items-center gap-app not-first-of-type:pt-8 pb-3'>
					<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
						Overview
					</h2>

					<Tooltip text='Why this exists — scope, limits, or constraints'>
						<Button
							mode='ghost'
							appearance='neutral'
							prefix={<Icon28HelpOutline width={18} height={18} />}
						>
							Help Button
						</Button>
					</Tooltip>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-col p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Redeem coupon
							</h3>

							<p className='text-sm text-foreground-secondary'>
								If your hardware supports this feature we we automatically lay
								of the processing to the hardware. Otherwise our built in
								software algorithm is used.
							</p>
						</div>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Gift a Lowtab.gg Subscription
							</h3>

							<p className='text-sm text-foreground-secondary'>
								If your hardware supports this feature we we automatically lay
								of the processing to the hardware. Otherwise our built in
								software algorithm is used.
							</p>
						</div>

						<ContextCard content={<p>$14.99 per month</p>}>
							<Button>Gift Subscription</Button>
						</ContextCard>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-col p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Privacy Policy
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
								volutpat, nunc vel ultrices sollicitudin, dolor eros volutpat
								ex, et sagittis sem enim in eros. Curabitur eu consequat neque,
								non finibus odio. Donec vitae tellus eu mauris feugiat
								efficitur.
							</p>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap items-center p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<p className='text-sm text-foreground-secondary'>
								Last updated: March 10, 2025
							</p>
						</div>

						<div className='ml-auto w-full @xl:w-2/5 flex gap-2'>
							<Button
								className='flex-1'
								type='button'
								size='sm'
								mode='secondary'
								appearance='neutral'
							>
								Decline
							</Button>

							<Button
								className='flex-1'
								type='submit'
								size='sm'
								appearance='neutral'
							>
								Accept
							</Button>
						</div>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
						Account Management
					</h2>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface outline-2 outline-offset-2 outline-danger'>
					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Rename organization
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Renaming your organization can have{' '}
								<Link
									href='/'
									target='_blank'
									className='text-link hover:text-link-secondary underline transition-colors'
								>
									unintended side effects
								</Link>
								.
							</p>
						</div>

						<Button mode='secondary' appearance='danger'>
							Rename
						</Button>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Archive this organization
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Marketing communications, including newsletters, raffles and
								surveys from FACE IT Ltd regarding esports events of ESL Gaming
								GmbH, ESL Gaming Online and Dreamhack AB as well as merchandise
								available in ESL Shops and collectables.
							</p>
						</div>

						<Button mode='secondary' appearance='danger'>
							Archive
						</Button>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Delete Account
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Permanently delete your account and all associated data. This
								action takes 30 days to be complete and is irreversible once 30
								days is up.
							</p>
						</div>

						<Button mode='secondary' appearance='danger'>
							Delete Account
						</Button>
					</div>
				</div>
			</section>

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-6'>
					<h1 className='text-3xl font-medium font-condensed tracking-tight'>
						Admin Panel
					</h1>

					<p className='text-lg text-foreground-secondary'>
						Looking for a starting point or more instructions? Head over to{' '}
						<a
							target='_blank'
							href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-foreground hover:text-accent underline'
							rel='noopener'
						>
							Templates
						</a>{' '}
						or the{' '}
						<a
							target='_blank'
							href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-foreground hover:text-accent underline'
							rel='noopener'
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
							rel='noopener'
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

			<div className='-z-10 absolute inset-x-0 top-0 w-full h-1/5 flex flex-col overflow-hidden'>
				<div className='absolute inset-0 -z-10'>
					<PixelBlast
						variant='square'
						pixelSize={2}
						color='#1212ce'
						patternScale={1}
						patternDensity={0.8}
						speed={1}
						bottomInset={640}
					/>
				</div>
			</div>

			<span />
		</>
	)
}
