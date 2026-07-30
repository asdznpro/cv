'use client'

import { forwardRef } from 'react'

import { twMerge } from 'tailwind-merge'

import { inputVariants } from './input.variants'
import type InputProps from './Input.interface'

export const Input = forwardRef<HTMLInputElement, InputProps>(
	function Input(props, ref) {
		const {
			status,
			mode,
			size,
			radius,
			prefix,
			suffix,
			className,
			...restProps
		} = props

		return (
			<span
				className={twMerge(
					'root',
					inputVariants({ mode, status, size, radius }),
					className,
				)}
			>
				<span className='in w-full h-full flex items-center justify-center py-1'>
					<span className='spacing w-0 h-full' />

					{prefix && (
						<span className='prefix flex gap-0.5 text-foreground-secondary'>
							{prefix}
						</span>
					)}

					<input
						{...restProps}
						ref={ref}
						className='content w-full h-full px-0.5 rounded-xs appearance-none outline-none placeholder:text-foreground-tertiary disabled:placeholder:text-foreground-tertiary/60 disabled:text-foreground-secondary disabled:cursor-not-allowed'
					/>

					{suffix && (
						<span className='suffix flex gap-0.5 text-foreground-secondary'>
							{suffix}
						</span>
					)}

					<span className='spacing w-0 h-full' />
				</span>
			</span>
		)
	},
)
