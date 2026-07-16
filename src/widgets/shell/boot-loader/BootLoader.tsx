'use client'

import { useState, useEffect, ViewTransition } from 'react'

import { AnimatePresence, motion } from 'motion/react'
import { useLockScroll } from '@siberiacancode/reactuse'

import { Gauge } from 'ui/blocks'
import { Logo } from 'ui/brand'

import { BOOT_DURATION_MS, useBoot } from './BootContext'

const SIZE = 160
const STROKE = 4
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function BootLoader() {
	const { bootVisible } = useBoot()

	useLockScroll({ enabled: bootVisible })

	const [value, setValue] = useState(0)

	useEffect(() => {
		if (!bootVisible) return

		const start = performance.now()
		let frame = 0

		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / BOOT_DURATION_MS)
			setValue(t * 100)
			if (t < 1) frame = requestAnimationFrame(tick)
		}

		frame = requestAnimationFrame(tick)

		return () => cancelAnimationFrame(frame)
	}, [bootVisible])

	return (
		<>
			<AnimatePresence>
				{bootVisible && (
					<motion.div
						key='boot-backdrop'
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
						className='fixed inset-0 z-50 bg-background'
					/>
				)}
			</AnimatePresence>

			{bootVisible && (
				<div className='fixed inset-0 z-50 flex items-center justify-center pointer-events-none'>
					<div
						className='relative flex items-center justify-center'
						style={{ width: SIZE, height: SIZE }}
					>
						<Gauge
							size='xl'
							appearance='neutral'
							value={value}
							className='absolute inset-0 [&_[data-gauge-path]]:transition-none'
						/>

						<ViewTransition name='brand-logo'>
							<Logo.Sign width={120} height={120} />
						</ViewTransition>
					</div>
				</div>
			)}
		</>
	)
}
