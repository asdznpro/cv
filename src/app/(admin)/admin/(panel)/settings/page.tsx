'use client'

import { Button, Separator, Kbd, Badge } from 'ui/blocks'
import { FormItem } from 'ui/forms'

import {
	Icon24SmartphoneOutline,
	Icon28ChevronDownOutline,
	Icon24TvOutline,
	Icon28MoreHorizontal,
} from '@vkontakte/icons'

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
							Profile Information
						</h2>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Full name
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Enter your full name as you would like it to be displayed in the
								dashboard
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='coupon-code'>
								<FormItem.Input
									size='md'
									mode='outline'
									type='text'
									value='Andrew'
									readOnly
								/>
							</FormItem>

							<FormItem id='coupon-code'>
								<FormItem.Input
									size='md'
									mode='outline'
									type='text'
									value='S.'
									readOnly
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Primary email
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Used for account notifications
							</p>
						</div>

						<div className='w-full @xl:w-2/5'>
							<FormItem id='short-domain'>
								<FormItem.Select
									size='md'
									mode='outline'
									options={[
										{ label: 'andrew@asdzn.pro', value: 'andrew@asdzn.pro' },
										{
											label: 'andrew.s@asdzn.pro',
											value: 'andrew.s@asdzn.pro',
										},
									]}
									value='andrew@asdzn.pro'
									placeholder='Select email'
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex items-center p-surface gap-surface'>
						<div className='ml-auto w-full @xl:w-2/5 flex gap-2'>
							<Button
								size='sm'
								className='flex-1'
								type='button'
								mode='secondary'
								appearance='neutral'
							>
								Cancel
							</Button>

							<Button size='sm' className='flex-1' type='submit'>
								Save
							</Button>
						</div>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Sign-in Methods
						</h2>

						<p className='text-sm text-foreground-secondary'>
							Manage the providers linked to your account and update their
							details
						</p>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-app'>
					<div className='flex flex-col bg-surface border border-separator rounded-surface'>
						<div className='flex flex-wrap p-surface gap-surface'>
							<Badge
								mode='soft'
								appearance='neutral'
								prefix={<Icon24TvOutline width={16} height={16} />}
							/>

							<div className='flex flex-1 flex-col gap-3'>
								<h3 className='text-xl font-medium font-condensed tracking-tight'>
									VK ID
								</h3>

								{/* <p className='text-sm text-foreground-secondary'>Browser</p> */}
							</div>

							<Button
								size='sm'
								mode='ghost'
								appearance='neutral'
								prefix={<Icon28MoreHorizontal width={16} height={16} />}
								iconOnly
							/>
						</div>
					</div>

					<div className='flex flex-col bg-surface/soft border border-dashed border-separator rounded-surface'>
						<div className='flex flex-wrap p-surface gap-surface'>
							{/* <Badge
								mode='soft'
								appearance='neutral'
								prefix={<Icon24TvOutline width={16} height={16} />}
							/>

							<div className='flex flex-1 flex-col gap-3'>
								<h3 className='text-xl font-medium font-condensed tracking-tight'>
									VK ID
								</h3>

								<p className='text-sm text-foreground-secondary'>Browser</p>
							</div> */}
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
								Choose your preferred sidebar behavior: expanded or collapsed
							</p>
						</div>

						<div className='w-full @xl:w-2/5'>
							<FormItem id='short-domain'>
								<FormItem.Select
									size='md'
									mode='outline'
									options={[
										{ label: 'Expanded', value: 'expanded' },
										{ label: 'Collapsed', value: 'collapsed' },
									]}
									value='expanded'
									placeholder='Select behavior'
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
									readOnly
								/>
							</FormItem>
						</div>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Keyboard Shortcuts
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

						<p className='font-medium font-condensed tracking-tight'>
							*Switch*
						</p>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='font-medium font-condensed tracking-tight'>
								Copy results as Markdown
							</h3>
						</div>

						<Kbd keys={['Shift', 'F']} />

						<p className='font-medium font-condensed tracking-tight'>
							*Switch*
						</p>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='font-medium font-condensed tracking-tight'>
								Expand/collapse sidebar
							</h3>
						</div>

						<Kbd keys={['Ctrl', 'B']} />

						<p className='font-medium font-condensed tracking-tight'>
							*Switch*
						</p>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='font-medium font-condensed tracking-tight'>
								Open notification center
							</h3>
						</div>

						<Kbd keys={['Shift', 'N']} />

						<p className='font-medium font-condensed tracking-tight'>
							*Switch*
						</p>
					</div>

					<Separator />

					<div className='flex p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='font-medium font-condensed tracking-tight'>
								Close something
							</h3>
						</div>

						<Kbd keys={['Esc']} />

						<p className='font-medium font-condensed tracking-tight'>
							*Switch*
						</p>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Active Sessions
						</h2>

						<p className='text-balance text-sm text-foreground-secondary'>
							This is a list of devices that have logged into your account.
							Revoke any sessions that you do not recognize.
						</p>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<Badge
							mode='soft'
							appearance='neutral'
							prefix={<Icon24TvOutline width={16} height={16} />}
						/>

						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Windows{' '}
								<Badge
									className='ml-1 mb-0.5 align-middle uppercase'
									size='sm'
									mode='soft'
									appearance='success'
								>
									Current session
								</Badge>
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Browser: Yandex Browser · IP: 13.143.203.210
								<br />
								Login: Aug 23, 2026 08:11:17 · Last seen: a few seconds ago
								<br />
								Location: Berlin, DE
							</p>
						</div>

						<Button mode='secondary' appearance='danger'>
							Logout
						</Button>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<Badge
							mode='soft'
							appearance='neutral'
							prefix={<Icon24SmartphoneOutline width={16} height={16} />}
						/>

						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Nothing phone (1), A063 · Android
							</h3>

							<p className='text-sm text-foreground-secondary'>
								Browser: Chrome Dev · IP: 79.136.250.142
								<br />
								Login: Aug 29, 2026 12:11:12 · Last seen: a few seconds ago
								<br />
								Location: Berlin, DE
							</p>
						</div>

						<Button mode='secondary' appearance='danger'>
							Revoke
						</Button>
					</div>
				</div>
			</section>

			<span />
		</>
	)
}
