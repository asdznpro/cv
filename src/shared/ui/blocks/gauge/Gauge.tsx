'use client'

import { forwardRef, useId } from 'react'
import { twMerge } from 'tailwind-merge'

import {
	gaugePathVariants,
	gaugeTrailVariants,
	gaugeValueVariants,
	gaugeVariants,
} from './gauge.variants'
import type GaugeProps from './Gauge.interface'

export const Gauge = forwardRef<HTMLDivElement, GaugeProps>(
	function Gauge(props, ref) {
		const {
			value = 0,
			maxValue = 100,
			size = 'md',
			appearance = 'accent',
			strokeWidth = 2,
			showValue = false,
			indeterminate = false,
			children,
			className,
			...restProps
		} = props

		const reactId = useId()
		const gradientId = `gauge-${reactId.replace(/:/g, '')}`

		const clamped = Math.min(Math.max(value, 0), maxValue)
		const progress = maxValue === 0 ? 0 : clamped / maxValue
		const offset = indeterminate ? 0.75 : 1 - progress

		return (
			<div
				ref={ref}
				role='progressbar'
				aria-valuemin={0}
				aria-valuemax={maxValue}
				aria-valuenow={indeterminate ? undefined : clamped}
				aria-busy={indeterminate || undefined}
				className={twMerge(gaugeVariants({ size, appearance }), className)}
				{...restProps}
			>
				<svg viewBox='0 0 100 100' className='size-full -rotate-90' aria-hidden>
					<circle
						cx='50'
						cy='50'
						r='45'
						pathLength={1}
						strokeDasharray={1}
						className={gaugeTrailVariants({ size })}
						style={strokeWidth ? { strokeWidth } : undefined}
					/>

					<circle
						data-gauge-path
						cx='50'
						cy='50'
						r='45'
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={offset}
						strokeLinecap='round'
						className={gaugePathVariants({ size, indeterminate })}
						style={strokeWidth ? { strokeWidth } : undefined}
					/>
				</svg>

				{(showValue || children) && (
					<span className={gaugeValueVariants({ size })}>
						{children ?? Math.round(progress * 100)}
					</span>
				)}
			</div>
		)
	},
)
