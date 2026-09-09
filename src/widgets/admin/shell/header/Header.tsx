'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { useLockScroll, useHotkeys } from '@siberiacancode/reactuse'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import {
	deleteAdminNotification,
	updateAdminNotificationStatus,
	type AdminNotification,
	type NotificationStatus,
} from 'lib/notifications'

import { Button, Counter, ScrollArea, Separator } from 'ui/blocks'
import { Backdrop } from 'ui/overlays'

import {
	Icon28HorizontalRectangle2VerticalLeftOutline,
	Icon28Notifications,
} from '@vkontakte/icons'

import { useAdminShell } from '../AdminShellProvider'
import { AnimatedLabel } from './AnimatedLabel'
import { NotificationList } from './NotificationList'

import { NAV_ITEMS } from '../sidebar'

type HeaderProps = {
	notifications: AdminNotification[]
}

export function Header({ notifications: initialNotifications }: HeaderProps) {
	const { open, toggle } = useAdminShell()
	const router = useRouter()

	// for menu

	const [isOpen, setIsOpen] = useState(false)
	const [notifications, setNotifications] = useState(initialNotifications)

	useEffect(() => {
		setNotifications(initialNotifications)
	}, [initialNotifications])

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

	const unreadCount = notifications.filter(item => item.status === 'new').length

	function patchNotification(id: string, next: Partial<AdminNotification>) {
		setNotifications(items =>
			items.map(item => (item.id === id ? { ...item, ...next } : item)),
		)
	}

	async function setStatus(id: string, status: NotificationStatus) {
		const previous = notifications
		patchNotification(id, { status })

		const result = await updateAdminNotificationStatus(id, status)
		if (!result.ok) {
			setNotifications(previous)
			toast.error(result.error)
			return
		}

		router.refresh()
	}

	async function removeNotification(id: string) {
		const previous = notifications
		setNotifications(items => items.filter(item => item.id !== id))

		const result = await deleteAdminNotification(id)
		if (!result.ok) {
			setNotifications(previous)
			toast.error(result.error)
			return
		}

		router.refresh()
	}

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

										{unreadCount > 0 && (
											<div className='absolute -top-1 -left-1 size-4 flex justify-end'>
												<Counter variant='danger'>{unreadCount}</Counter>
											</div>
										)}
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

										<ScrollArea className='h-120'>
											<NotificationList
												notifications={notifications}
												onStatusChange={(id, status) =>
													void setStatus(id, status)
												}
												onDelete={id => void removeNotification(id)}
											/>
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
