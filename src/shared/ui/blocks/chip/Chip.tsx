'use client'

import Link from 'next/link'
import { forwardRef } from 'react'

import { twMerge } from 'tailwind-merge'

import { chipVariants } from './chip.variants'
import type ChipProps from './Chip.interface'

type ChipElement = HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement

export const Chip = forwardRef<ChipElement, ChipProps>((props, ref) => {
	const {
		children,
		mode,
		appearance,
		size,
		radius,
		disabled,
		prefix,
		suffix,
		className,
		to,
		href,
		target,
		type,
		onClick,
		...restProps
	} = props

	const wantsNavigation = Boolean(href || to)
	const isInteractive = Boolean(onClick || href || to)

	let Component: React.ElementType = 'span'
	let additionalProps: Record<string, unknown> = {}

	if (isInteractive) {
		if (disabled && wantsNavigation) {
			Component = 'button'
			additionalProps = {
				type: type ?? 'button',
				disabled: true,
			}
		} else if (href) {
			Component = 'a'
			additionalProps = {
				href,
				target,
				rel: target === '_blank' ? 'noopener noreferrer' : undefined,
			}
		} else if (to) {
			Component = Link
			additionalProps = { href: to, target }
		} else {
			Component = 'button'
			additionalProps = {
				type: type ?? 'button',
				disabled: Boolean(disabled),
			}
		}
	}

	return (
		<Component
			{...restProps}
			{...additionalProps}
			ref={ref}
			onClick={isInteractive ? onClick : undefined}
			data-interactive={!disabled && isInteractive ? true : undefined}
			className={twMerge(
				'root',
				chipVariants({
					mode,
					appearance,
					size,
					radius,
					iconOnly: children === undefined,
				}),
				className,
			)}
		>
			<span className='in min-w-0 flex items-center justify-center'>
				{prefix && <span className='prefix flex gap-0.5'>{prefix}</span>}

				{children && (
					<span className='content px-0.5 truncate'>{children}</span>
				)}

				{suffix && <span className='suffix flex gap-0.5'>{suffix}</span>}
			</span>
		</Component>
	)
})
