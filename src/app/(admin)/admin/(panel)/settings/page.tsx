'use client'

import { Icon28ChevronDownOutline } from '@vkontakte/icons'
import { Button, Separator, Kbd } from 'ui/blocks'
import { FormItem } from 'ui/forms'

export default function Settings() {
	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						Preferences
					</h1>

					<p className='text-foreground-secondary text-balance'>
						Manage your account profile, connections, and dashboard experience
					</p>
				</div>
			</section>

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Profile information
						</h2>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								First name
							</h3>
						</div>

						<div className='w-full @xl:w-2/5'>
							<FormItem id='coupon-code'>
								<FormItem.Input
									size='md'
									mode='outline'
									type='text'
									value='Andrew'
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Last name
							</h3>
						</div>

						<div className='w-full @xl:w-2/5'>
							<FormItem id='coupon-code'>
								<FormItem.Input
									size='md'
									mode='outline'
									type='text'
									value='S.'
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex items-center p-surface gap-surface'>
						<div className='ml-auto w-full @xl:w-2/5 flex gap-2'>
							<Button
								className='flex-1'
								type='button'
								mode='secondary'
								appearance='neutral'
							>
								Cancel
							</Button>

							<Button className='flex-1' type='submit'>
								Save
							</Button>
						</div>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Appearance
						</h2>

						<p className='text-sm text-foreground-secondary'>
							Choose how Supabase looks and behaves in the dashboard
						</p>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Sidebar behavior
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Choose your preferred sidebar behavior: open, closed, or expand
								on hover
							</p>
						</div>

						<div className='w-full @xl:w-2/5'>
							<FormItem id='coupon-code'>
								<FormItem.Input
									mode='outline'
									size='md'
									type='text'
									value='Expanded'
									suffix={<Icon28ChevronDownOutline width={18} height={18} />}
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
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

						<div className='w-full @xl:w-2/5'>
							<FormItem id='coupon-code'>
								<FormItem.Input
									mode='outline'
									size='md'
									type='text'
									value='Expanded'
									suffix={<Icon28ChevronDownOutline width={18} height={18} />}
								/>
							</FormItem>
						</div>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Keyboard shortcuts
						</h2>

						<p className='text-sm text-foreground-secondary'>
							Choose which shortcuts stay active while working in the dashboard
						</p>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='font-medium font-condensed tracking-tight'>
								Open command menu
							</h3>
						</div>

						<Kbd keys={['Ctrl', 'K']} />

						<h3 className='font-medium font-condensed tracking-tight'>
							*Switch*
						</h3>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='font-medium font-condensed tracking-tight'>
								Copy results as Markdown
							</h3>
						</div>

						<Kbd keys={['Shift', 'F']} />

						<h3 className='font-medium font-condensed tracking-tight'>
							*Switch*
						</h3>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='font-medium font-condensed tracking-tight'>
								Add project connection
							</h3>
						</div>

						<Kbd keys={['Shift', 'F']} />

						<h3 className='font-medium font-condensed tracking-tight'>
							*Switch*
						</h3>
					</div>
				</div>
			</section>

			<span />
		</>
	)
}
