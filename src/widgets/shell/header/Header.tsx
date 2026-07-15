'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { AnimatePresence, motion } from 'motion/react'
import { useLockScroll, useHotkeys } from '@siberiacancode/reactuse'
import { twMerge } from 'tailwind-merge'

import { Badge, Button, Separator } from 'ui/blocks'
import { Logo } from 'ui/brand'

import {
	Icon28AddOutline,
	Icon28HieroglyphCharacterOutline,
	Icon28LinkOutline,
} from '@vkontakte/icons'

const NAV_ITEMS = [
	{
		label: 'About',
		href: '/about',
	},
	{
		label: 'Portfolio',
		href: '/portfolio',
	},
	{
		label: 'Experience',
		href: '/experience',
	},
	{
		label: 'Skills',
		href: '/skills',
	},
	{
		label: 'Contact',
		href: '/contact',
	},
]

const SOCIAL_ITEMS = [
	{
		label: 'GitHub',
		href: 'https://github.com/asdzn',
		icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'bg-github hover:bg-github-secondary',
	},

	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/asdzn',
		icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'bg-linkedin hover:bg-linkedin-secondary',
	},

	{
		label: 'Telegram',
		href: 'https://t.me/asdznpro',
		icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'bg-telegram hover:bg-telegram-secondary',
	},
	{
		label: 'VK',
		href: 'https://vk.com/asdzn',
		icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'bg-vk hover:bg-vk-secondary',
	},
]

export function Header() {
	const [isOpen, setIsOpen] = useState(false)

	// for navigation

	const pathname = usePathname()

	const isActiveRoute = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`)

	const activeItem = NAV_ITEMS.find(item => isActiveRoute(item.href))
	const activeLabel = activeItem?.label ?? 'Home'

	// for menu

	useLockScroll({ enabled: isOpen })

	useHotkeys('escape', () => setIsOpen(false), { enabled: isOpen })
	useHotkeys('shift+f, shift+а', event => {
		event.preventDefault()
		setIsOpen(value => !value)
	})

	return (
		<header className='fixed top-0 z-20 w-full max-h-screen pointer-events-none'>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						aria-hidden='true'
						initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
						animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
						exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
						transition={{ duration: 0.2 }}
						onClick={() => setIsOpen(false)}
						className='fixed inset-0 z-0 pointer-events-auto bg-background/80'
					/>
				)}
			</AnimatePresence>

			<motion.div
				onClickCapture={event => {
					const target = event.target
					if (target instanceof Element && target.closest('a[href]')) {
						setIsOpen(false)
					}
				}}
				initial={false}
				animate={{
					maxWidth: isOpen ? '48rem' : '42rem',
				}}
				transition={{
					type: 'spring',
					stiffness: 300,
					damping: 20,
				}}
				className='mx-auto h-full flex items-center p-app pointer-events-auto'
			>
				<motion.div className='w-full h-full flex flex-col bg-background border border-separator rounded-4xl backdrop-blur-3xl overflow-hidden'>
					<div className='w-full flex items-center p-2 gap-2'>
						<span className='w-full flex gap-app'>
							<Link
								href='/'
								className='flex rounded-full transition-all focus-ring-base focus-ring-visible'
							>
								<Logo.Sign width={44} height={44} />
							</Link>
						</span>

						<motion.span
							layout='position'
							transition={{
								layout: {
									type: 'spring',
									stiffness: 350,
									damping: 30,
								},
							}}
							className='text-2xl font-medium font-condensed tracking-tight whitespace-nowrap'
						>
							<Link
								href='/'
								className='text-foreground-tertiary hover:text-foreground transition-all'
							>
								CV
							</Link>{' '}
							<span className='text-foreground-tertiary select-none'>/</span>{' '}
							<motion.span
								layout
								transition={{
									layout: {
										type: 'spring',
										stiffness: 350,
										damping: 30,
									},
								}}
								className='relative inline-flex overflow-hidden align-bottom'
							>
								<AnimatePresence initial={false} mode='popLayout'>
									<motion.span
										key={activeLabel}
										transition={{ duration: 0.12 }}
										className='inline-block'
									>
										{activeLabel}
									</motion.span>
								</AnimatePresence>
							</motion.span>
						</motion.span>

						<span className='w-full flex justify-end gap-2'>
							{/* <Button
								size='lg'
								mode='secondary'
								appearance='neutral'
								prefix={
									<Icon28HieroglyphCharacterOutline width={20} height={20} />
								}
								radius='rounded'
							>
								RU
							</Button> */}

							<Button
								onClick={() => setIsOpen(value => !value)}
								aria-expanded={isOpen}
								aria-controls='header-menu'
								size='lg'
								appearance='neutral'
								prefix={
									<motion.span
										animate={{ rotate: isOpen ? 45 : 0 }}
										transition={{ type: 'spring', stiffness: 400, damping: 24 }}
										className='flex'
									>
										<Icon28AddOutline width={20} height={20} />
									</motion.span>
								}
								radius='rounded'
								iconOnly
							/>
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

								<div className='grid grid-cols-2 @lg:grid-cols-4 p-2 gap-2 select-none'>
									<nav className='col-span-2 row-span-2 flex flex-col gap-2'>
										{NAV_ITEMS.map(item => {
											const isActive = isActiveRoute(item.href)

											return (
												<Link
													key={item.label}
													href={item.href}
													aria-current={isActive ? 'page' : undefined}
													className={twMerge(
														'w-full h-14 flex items-center px-4 rounded-lg transition-colors focus-ring-base focus-ring-visible',
														isActive
															? 'bg-surface text-foreground'
															: 'text-foreground-secondary hover:bg-surface focus-visible:bg-surface',
													)}
												>
													<span className='text-2xl font-medium font-condensed tracking-tight truncate'>
														{item.label}
													</span>
												</Link>
											)
										})}
									</nav>

									{SOCIAL_ITEMS.map((item, index) => (
										<a
											key={index + item.label}
											href={item.href}
											target='_blank'
											rel='noopener noreferrer'
											className={twMerge(
												'root relative w-full h-full flex items-end p-4 rounded-lg transition-colors focus-ring-base focus-ring-visible',
												item.className,
											)}
										>
											<Badge
												className='absolute top-2 right-2'
												size='md'
												appearance='neutral'
												prefix={<Icon28LinkOutline width={14} height={14} />}
											/>

											<span className='text-2xl text-white font-medium font-condensed tracking-tight truncate'>
												{item.label}
											</span>
										</a>
									))}
								</div>

								<Separator />

								<div className='w-full h-fit flex items-center p-2 gap-2'>
									<div className='w-full h-14 flex items-center px-4 gap-4 text-foreground-tertiary'>
										<span>
											&copy; {new Date().getFullYear()}, Andrew Sukhushin / CV
										</span>

										{/* <span className='ml-auto'>v0.2.6-beta, 29.1.26</span> */}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</header>
	)
}
