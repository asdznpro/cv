'use client'

import { useState, ViewTransition } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { AnimatePresence, motion } from 'motion/react'
import { useLockScroll, useHotkeys } from '@siberiacancode/reactuse'
import { twMerge } from 'tailwind-merge'

import { useBoot } from 'widgets/shell'

import { Badge, Button, Separator } from 'ui/blocks'
import { Logo } from 'ui/brand'
import { Backdrop } from 'ui/overlays'

import {
	Icon28AddOutline,
	Icon28HieroglyphCharacterOutline,
	Icon28LinkOutline,
} from '@vkontakte/icons'

const NAV_ITEMS = [
	{
		label: 'All Articles',
		href: '/articles',
	},
	{
		label: 'Article / About',
		href: '/articles/about',
	},
	{
		label: 'Article / Experience',
		href: '/articles?category=experience',
	},
	{
		label: 'Portfolio',
		href: '/portfolio',
	},
	{
		label: 'Toolkit',
		href: '/toolkit',
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
		href: 'https://telegram.me/asdznpro',
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
	const { bootVisible } = useBoot()

	// for navigation

	const pathname = usePathname()

	const isActiveRoute = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`)

	const activeItem = NAV_ITEMS.find(item => isActiveRoute(item.href))
	const activeLabel = activeItem?.label ?? 'Home'

	// for menu

	const [isOpen, setIsOpen] = useState(false)

	useLockScroll({ enabled: isOpen })

	useHotkeys('escape', () => setIsOpen(false), { enabled: isOpen })
	useHotkeys('shift+f, shift+а', event => {
		event.preventDefault()
		setIsOpen(value => !value)
	})

	return (
		<header className='fixed top-0 z-20 w-full max-h-screen p-app pointer-events-none'>
			<AnimatePresence>
				{isOpen && (
					<Backdrop
						key='backdrop'
						className='z-0'
						aria-hidden
						onClick={() => setIsOpen(false)}
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
					maxWidth: isOpen ? '48rem' : '32rem',
				}}
				transition={{
					type: 'spring',
					stiffness: 300,
					damping: 20,
				}}
				className='mx-auto w-full h-full flex items-center pointer-events-auto'
			>
				<motion.div className='z-1 w-full h-full flex flex-col bg-background border border-separator rounded-[31px] overflow-hidden'>
					<div className='w-full flex items-center p-2 gap-2'>
						<span className='w-full flex gap-app'>
							<Link
								href='/'
								className='flex rounded-full transition-all focus-ring-base focus-ring-visible'
							>
								{/* <ViewTransition name='brand-logo'> */}
								<Logo.Sign size={44} />
								{/* </ViewTransition> */}
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
										transition={{
											type: 'spring',
											stiffness: 400,
											damping: 24,
										}}
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
															? 'bg-surface-secondary text-foreground'
															: 'text-foreground-secondary hover:bg-surface-secondary focus-visible:bg-surface',
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
