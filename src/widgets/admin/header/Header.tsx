'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'

import { useAdminShell } from '../shell'
import { NAV_ITEMS } from '../sidebar'

import { Button } from 'ui/blocks'
import {
	Icon28HorizontalRectangle2VerticalLeftOutline,
	Icon28GlobeOutline,
} from '@vkontakte/icons'

function AnimatedLabel({ label }: { label: string }) {
	const measureRef = useRef<HTMLSpanElement>(null)
	const [width, setWidth] = useState<number | null>(null)
	const canSpring = useRef(false)

	useLayoutEffect(() => {
		const next = measureRef.current?.offsetWidth
		if (next == null) return
		setWidth(next)
	}, [label])

	useLayoutEffect(() => {
		if (width == null) return
		canSpring.current = true
	}, [width])

	return (
		<span className='relative inline-block align-bottom'>
			<span
				ref={measureRef}
				aria-hidden
				className='pointer-events-none absolute top-0 left-0 whitespace-nowrap opacity-0'
			>
				{label}
			</span>

			{width == null ? (
				<span className='inline-block whitespace-nowrap'>{label}</span>
			) : (
				<motion.span
					initial={false}
					animate={{ width }}
					transition={
						canSpring.current
							? { type: 'spring', stiffness: 350, damping: 30 }
							: { duration: 0 }
					}
					className='relative inline-block min-w-0 overflow-hidden align-bottom whitespace-nowrap'
					style={{ height: '1lh' }}
				>
					<AnimatePresence initial={false}>
						<motion.span
							key={label}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.12 }}
							className='absolute top-0 left-0 whitespace-nowrap'
						>
							{label}
						</motion.span>
					</AnimatePresence>
				</motion.span>
			)}
		</span>
	)
}

export function Header() {
	const { open, toggle } = useAdminShell()

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

	return (
		<header className='sticky top-0 z-10 pointer-events-none'>
			<div className='mx-auto max-w-lg flex items-center p-app'>
				<div className='w-full flex items-center p-2 gap-2 bg-background border border-separator rounded-full pointer-events-auto'>
					<span className='w-full flex gap-app'>
						<Button
							aria-label={open ? 'Hide sidebar' : 'Show sidebar'}
							onClick={toggle}
							mode='soft'
							appearance='neutral'
							prefix={
								<Icon28HorizontalRectangle2VerticalLeftOutline
									className='rotate-180'
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
						<span className='text-foreground-tertiary select-none'>/</span>{' '}
						<AnimatedLabel label={activeLabel} />
					</span>

					<span className='w-full flex justify-end gap-2'>
						<Button
							to='/'
							appearance='neutral'
							prefix={<Icon28GlobeOutline width={18} height={18} />}
							radius='rounded'
							iconOnly
						/>
					</span>
				</div>
			</div>
		</header>
	)
}
