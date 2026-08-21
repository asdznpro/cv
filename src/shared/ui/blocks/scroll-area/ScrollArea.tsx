'use client'

import { twMerge } from 'tailwind-merge'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'

import 'overlayscrollbars/overlayscrollbars.css'
import './scroll-area.css'

import type ScrollAreaProps from './ScrollArea.interface'

const THEME = 'os-theme-cv'

export function ScrollArea(props: ScrollAreaProps) {
	const {
		children,
		className,
		overflow = 'y',
		autoHide = 'leave',
		defer = true,
		options,
		...restProps
	} = props

	return (
		<OverlayScrollbarsComponent
			{...restProps}
			defer={defer}
			className={twMerge('root min-h-0', className)}
			options={{
				...options,
				overflow: {
					x: overflow === 'y' ? 'hidden' : 'scroll',
					y: overflow === 'x' ? 'hidden' : 'scroll',
					...options?.overflow,
				},
				scrollbars: {
					autoHide,
					autoHideDelay: 0,
					autoHideSuspend: true,
					...options?.scrollbars,
					theme: THEME,
				},
			}}
		>
			{children}
		</OverlayScrollbarsComponent>
	)
}
