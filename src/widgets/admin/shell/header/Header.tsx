'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useLockScroll, useHotkeys } from '@siberiacancode/reactuse'
import { motion, AnimatePresence } from 'motion/react'
import { twMerge } from 'tailwind-merge'

import { getFormattedDate } from 'lib/utils'

import {
	Badge,
	Button,
	Counter,
	EmptyState,
	ScrollArea,
	Separator,
} from 'ui/blocks'
import { DropdownMenu } from 'ui/floating'
import { Backdrop } from 'ui/overlays'

import {
	Icon28DeleteOutline,
	Icon28EditOutline,
	Icon28HorizontalRectangle2VerticalLeftOutline,
	Icon28MoreHorizontal,
	Icon28ChainOutline,
	Icon28Notifications,
	Icon28LinkOutline,
	Icon28NotificationDisableOutline,
} from '@vkontakte/icons'

import { useAdminShell } from '../AdminShellProvider'
import { AnimatedLabel } from './AnimatedLabel'

import { NAV_ITEMS } from '../sidebar'
import { NOTIFICATIONS_DATA, sortNotifications } from 'shared/data'

export function Header() {
	const { open, toggle } = useAdminShell()

	// for menu

	const [isOpen, setIsOpen] = useState(false)

	useLockScroll({ enabled: isOpen })

	useHotkeys('escape', () => setIsOpen(false), { enabled: isOpen })
	useHotkeys('shift+n, shift+т', event => {
		event.preventDefault()
		setIsOpen(value => !value)
	})

	// for navigation

	const pathname = usePathname()

	const activeHref = NAV_ITEMS.flatMap(section =>
		section.items.map(item => item.href),
	)
		.filter(href => pathname === href || pathname.startsWith(`${href}/`))
		.sort((a, b) => b.length - a.length)[0]

	const activeLabel =
		NAV_ITEMS.flatMap(section => section.items).find(
			item => item.href === activeHref,
		)?.label ?? 'Overview'

	// for notifications

	const notifications = useMemo(() => sortNotifications(NOTIFICATIONS_DATA), [])
	const unreadCount = notifications.filter(item => item.status === 'new').length

	const notificationGroups = [
		{
			status: 'new' as const,
			label: 'New',
			items: notifications.filter(item => item.status === 'new'),
		},
		{
			status: 'viewed' as const,
			label: 'Viewed',
			items: notifications.filter(item => item.status === 'viewed'),
		},
	].filter(group => group.items.length > 0)

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<Backdrop
						key='backdrop'
						className='z-10 absolute inset-0'
						aria-hidden
						onClick={() => setIsOpen(false)}
					/>
				)}
			</AnimatePresence>

			<header className='sticky top-0 inset-x-0 z-20 w-full pointer-events-none'>
				<motion.div
					onClickCapture={event => {
						const target = event.target
						if (target instanceof Element && target.closest('a[href]')) {
							setIsOpen(false)
						}
					}}
					initial={false}
					animate={{
						maxWidth: isOpen ? '36rem' : '28rem',
					}}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 20,
					}}
					className='mx-auto max-w-2xl w-full flex p-app'
				>
					<div className='relative w-full'>
						<span className='flex w-full h-13.5' />

						<motion.div className='absolute top-0 inset-x-0 w-full flex flex-col bg-background border border-separator rounded-[27px] overflow-hidden pointer-events-auto'>
							<div className='w-full flex items-center p-2 gap-2'>
								<span className='w-full flex gap-app'>
									<Button
										aria-label={open ? 'Hide sidebar' : 'Show sidebar'}
										onClick={toggle}
										mode='soft'
										appearance='neutral'
										prefix={
											<Icon28HorizontalRectangle2VerticalLeftOutline
												className={twMerge(
													'transition-transform rotate-180',
													!open && '-scale-x-100',
												)}
												width={18}
												height={18}
											/>
										}
										radius='rounded'
										iconOnly
									/>
								</span>

								<span className='text-xl font-medium font-condensed tracking-tight whitespace-nowrap'>
									<Link
										href='/admin'
										className='text-foreground-tertiary hover:text-foreground transition-all'
									>
										Admin
									</Link>{' '}
									<span className='text-foreground-tertiary select-none'>
										/
									</span>{' '}
									<AnimatedLabel label={activeLabel} />
								</span>

								<span className='w-full flex justify-end gap-2'>
									<div className='relative'>
										<Button
											aria-label='Notifications'
											aria-expanded={isOpen}
											onClick={() => setIsOpen(value => !value)}
											mode='soft'
											appearance='neutral'
											prefix={<Icon28Notifications width={18} height={18} />}
											radius='rounded'
											iconOnly
										/>

										<div className='absolute -top-1 -left-1 size-4 flex justify-end'>
											<Counter variant='danger'>{unreadCount}</Counter>
										</div>
									</div>
								</span>
							</div>

							<AnimatePresence initial={false}>
								{isOpen && (
									<motion.div
										id='header-menu'
										key='header-menu'
										initial={{ height: 0 }}
										animate={{ height: 'auto' }}
										exit={{ height: 0 }}
										transition={{
											height: {
												type: 'tween',
												duration: 0.2,
												ease: 'easeInOut',
											},
										}}
										className='h-full'
									>
										<Separator />

										<ScrollArea className='h-100'>
											{notificationGroups.length === 0 ? (
												<EmptyState
													className='h-full'
													icon={
														<Icon28NotificationDisableOutline
															width={24}
															height={24}
														/>
													}
													title='No notifications'
													summary='There are no notifications. You will receive notifications when there are new articles, short links, or other content.'
												/>
											) : (
												<div className='flex flex-col p-2 gap-2'>
													{notificationGroups.map(group => (
														<div
															key={group.status}
															className='flex flex-col gap-2'
														>
															<span className='px-surface py-1 text-xs text-foreground-secondary'>
																{group.label}
															</span>

															{group.items.map(notification => (
																<div
																	key={notification.id}
																	className='group flex flex-1 p-surface gap-surface rounded-md bg-surface-secondary/strong'
																>
																	<Badge
																		mode='soft'
																		appearance={
																			notification.status === 'new'
																				? 'accent'
																				: 'neutral'
																		}
																		prefix={
																			<Icon28ChainOutline
																				width={16}
																				height={16}
																			/>
																		}
																	/>

																	<div className='flex flex-1 flex-col gap-2'>
																		<h3 className='text-lg font-medium font-condensed tracking-tight'>
																			{notification.title}
																		</h3>

																		{notification.description && (
																			<p className='text-sm text-foreground-secondary'>
																				{notification.description}
																			</p>
																		)}

																		<p className='text-sm text-foreground-secondary'>
																			{notification.status === 'new' && (
																				<span className='mr-1.75 mb-0.5 inline-flex size-1.75 bg-accent rounded-full animate-pulse align-middle' />
																			)}
																			{
																				getFormattedDate(notification.createdAt)
																					.relative
																			}
																		</p>
																	</div>

																	<div className='flex gap-2'>
																		{notification.href && (
																			<Button
																				to={notification.href}
																				size='sm'
																				mode='soft'
																				appearance='neutral'
																				suffix={
																					<Icon28LinkOutline
																						width={16}
																						height={16}
																					/>
																				}
																			>
																				View
																			</Button>
																		)}

																		<DropdownMenu>
																			<DropdownMenu.Trigger>
																				<Button
																					size='sm'
																					mode='ghost'
																					appearance='neutral'
																					prefix={
																						<Icon28MoreHorizontal
																							width={16}
																							height={16}
																						/>
																					}
																					iconOnly
																				/>
																			</DropdownMenu.Trigger>

																			<DropdownMenu.Content className='w-32'>
																				<DropdownMenu.Box>
																					<DropdownMenu.Item
																						aria-label='Edit toolkit item'
																						prefix={
																							<Icon28EditOutline
																								width={18}
																								height={18}
																							/>
																						}
																					>
																						Edit
																					</DropdownMenu.Item>

																					<DropdownMenu.Item
																						aria-label='Delete toolkit item'
																						appearance='danger'
																						prefix={
																							<Icon28DeleteOutline
																								width={18}
																								height={18}
																							/>
																						}
																					>
																						Delete
																					</DropdownMenu.Item>
																				</DropdownMenu.Box>
																			</DropdownMenu.Content>
																		</DropdownMenu>
																	</div>
																</div>
															))}
														</div>
													))}
												</div>
											)}
										</ScrollArea>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</div>
				</motion.div>
			</header>
		</>
	)
}
