'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function AnimatedLabel({ label }: { label: string }) {
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
