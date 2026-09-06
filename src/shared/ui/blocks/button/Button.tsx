'use client'

import Link from 'next/link'
import { forwardRef } from 'react'

import { twMerge } from 'tailwind-merge'

import { buttonVariants } from './button.variants'
import type { ButtonProps } from './Button.interface'

export const Button = forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	ButtonProps
>((props, ref) => {
	const {
		children,
		mode,
		appearance,
		size,
		align,
		radius,
		disabled,
		as,
		iconOnly,
		prefix,
		suffix,
		className,
		to,
		prefetch,
		href,
		target,
		...restProps
	} = props

	const wantsNavigation = Boolean(href || to)
	const isInactive = Boolean(disabled)

	let Component: React.ElementType = 'button'
	let additionalProps: Record<string, unknown> = {}

	if (disabled && wantsNavigation) {
		Component = 'button'
		additionalProps = {
			type: restProps.type ?? 'button',
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
		additionalProps = { href: to, target, prefetch }
	} else if (as === 'span') {
		Component = 'span'
		additionalProps = {
			'aria-disabled': isInactive || undefined,
		}
	} else {
		Component = 'button'
		additionalProps = {
			type: restProps.type ?? 'button',
			disabled: isInactive,
		}
	}

	const isInteractive = Component !== 'span'

	const showSpacing = Boolean(children) || Boolean(prefix && suffix)

	return (
		<Component
			{...restProps}
			{...additionalProps}
			ref={ref}
			onClick={isInteractive ? restProps.onClick : undefined}
			data-interactive={isInteractive ? true : undefined}
			className={twMerge(
				'group root',
				buttonVariants({
					mode,
					appearance,
					size,
					align,
					radius,
				}),
				className,
			)}
		>
			<span className='in min-w-0 w-full items-center'>
				{showSpacing && <span className='spacing w-0 h-full' />}

				{prefix && <span className='prefix flex gap-0.5'>{prefix}</span>}

				{children && !iconOnly && (
					<span className='content px-0.5 truncate'>{children}</span>
				)}

				{suffix && <span className='suffix flex gap-0.5'>{suffix}</span>}

				{showSpacing && <span className='spacing w-0 h-full' />}
			</span>
		</Component>
	)
})
