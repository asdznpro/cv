'use client'

import { twMerge } from 'tailwind-merge'

import { counterVariants } from './counter.variants'
import type CounterProps from './Counter.interface'

export const Counter = (props: CounterProps) => {
	const { children, variant, size, className, ...restProps } = props

	return (
		<span
			{...restProps}
			className={twMerge(
				'root',
				counterVariants({
					variant,
					size,
				}),
				className,
			)}
		>
			{children}
		</span>
	)
}
