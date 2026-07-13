'use client'

import { forwardRef, useCallback } from 'react'
import { twMerge } from 'tailwind-merge'

import type {
	CarouselContentProps,
	CarouselItemProps,
	CarouselViewportProps,
} from './Carousel.interface'

import { useCarousel } from './Carousel.context'

export const CarouselViewport = forwardRef<
	HTMLDivElement,
	CarouselViewportProps
>(function CarouselViewport({ className, children, ...props }, forwardedRef) {
	const { viewportRef } = useCarousel()

	const setRef = useCallback(
		(node: HTMLDivElement | null) => {
			viewportRef(node)

			if (typeof forwardedRef === 'function') {
				forwardedRef(node)
			} else if (forwardedRef) {
				forwardedRef.current = node
			}
		},
		[viewportRef, forwardedRef],
	)

	return (
		<div
			{...props}
			ref={setRef}
			className={twMerge('relative w-full min-w-0', className)}
		>
			{children}
		</div>
	)
})

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
	function CarouselContent({ className, children, ...props }, ref) {
		return (
			<div
				{...props}
				ref={ref}
				className={twMerge(
					'flex gap-md touch-pan-y touch-pinch-zoom select-none',
					className,
				)}
			>
				{children}
			</div>
		)
	},
)

export function CarouselItem({
	className,
	children,
	...props
}: CarouselItemProps) {
	return (
		<div
			{...props}
			role='group'
			aria-roledescription='slide'
			className={twMerge('min-w-0 shrink-0 basis-full', className)}
		>
			{children}
		</div>
	)
}
