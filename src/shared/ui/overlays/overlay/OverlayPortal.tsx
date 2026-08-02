'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

import { Backdrop } from '../backdrop'
import type { OverlayEntry } from './overlay.types'

const TRANSITION = {
	duration: 0.12,
	ease: 'easeOut',
} as const

type OverlayPortalProps = {
	stack: OverlayEntry[]
	onDismiss: () => void
}

export function OverlayPortal({ stack, onDismiss }: OverlayPortalProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	const top = stack.at(-1)
	const dismissible = Boolean(top?.dismissible)

	return createPortal(
		<>
			<AnimatePresence>
				{stack.length > 0 && (
					<Backdrop
						key='overlay-backdrop'
						className='z-60'
						onClick={dismissible ? onDismiss : undefined}
					/>
				)}
			</AnimatePresence>

			<div
				role='presentation'
				className='fixed inset-0 z-70 flex items-center justify-center p-app pointer-events-none'
			>
				<AnimatePresence mode='wait' initial={false}>
					{top && (
						<motion.div
							key={top.id}
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							transition={TRANSITION}
							className='pointer-events-auto w-full max-w-lg'
						>
							{top.content}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>,
		document.body,
	)
}
