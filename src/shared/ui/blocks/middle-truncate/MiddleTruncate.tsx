'use client'

import { useRef } from 'react'

import { twMerge } from 'tailwind-merge'

import type MiddleTruncateProps from './MiddleTruncate.interface'
import { useMiddleTruncate } from './use-middle-truncate'

export function MiddleTruncate({
	value,
	className,
	onCopy,
	...restProps
}: MiddleTruncateProps) {
	const ref = useRef<HTMLSpanElement>(null)
	const displayed = useMiddleTruncate(ref, value)
	const truncated = displayed !== value

	return (
		<span
			{...restProps}
			title={value}
			className={twMerge('block min-w-0 w-full', className)}
			onCopy={event => {
				onCopy?.(event)
				if (event.defaultPrevented) return
				event.clipboardData.setData('text/plain', value)
				event.preventDefault()
			}}
		>
			<span
				ref={ref}
				aria-hidden={truncated}
				className='block min-w-0 w-full whitespace-nowrap'
			>
				{displayed}
			</span>
			{truncated && <span className='sr-only'>{value}</span>}
		</span>
	)
}
