'use client'

import { forwardRef } from 'react'
import { motion, type Transition } from 'motion/react'
import { twMerge } from 'tailwind-merge'

import { backdropVariants } from './backdrop.variants'
import type BackdropProps from './Backdrop.interface'

const DEFAULT_TRANSITION: Transition = {
	duration: 0.2,
	ease: 'easeOut',
}

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
	(props, ref) => {
		const {
			tone = 'scrim',
			blur = true,
			blurAmount = 6,
			className,
			transition,
			initial,
			animate,
			exit,
			onClick,
			'aria-label': ariaLabel,
			...rest
		} = props

		const withBlur = blur && tone !== 'solid'
		const isDismissible = typeof onClick === 'function'

		return (
			<motion.div
				ref={ref}
				aria-hidden={isDismissible ? undefined : true}
				aria-label={isDismissible ? (ariaLabel ?? 'Close') : ariaLabel}
				initial={
					initial ??
					(withBlur
						? { opacity: 0, backdropFilter: 'blur(0px)' }
						: { opacity: 0 })
				}
				animate={
					animate ??
					(withBlur
						? { opacity: 1, backdropFilter: `blur(${blurAmount}px)` }
						: { opacity: 1 })
				}
				exit={
					exit ??
					(withBlur
						? { opacity: 0, backdropFilter: 'blur(0px)' }
						: { opacity: 0 })
				}
				transition={transition ?? DEFAULT_TRANSITION}
				onClick={onClick}
				className={twMerge(
					backdropVariants({ tone }),
					isDismissible && 'cursor-pointer',
					className,
				)}
				{...rest}
			/>
		)
	},
)

Backdrop.displayName = 'Backdrop'
