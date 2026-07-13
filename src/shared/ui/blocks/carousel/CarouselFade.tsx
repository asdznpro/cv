'use client'

import { useEffect, useState } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

import { twMerge } from 'tailwind-merge'

import { useCarousel } from './Carousel.context'

interface CarouselFadeProps extends ComponentPropsWithoutRef<'div'> {
	size?: number | string
}

interface CarouselFadeStyle extends CSSProperties {
	'--carousel-fade-start': string
	'--carousel-fade-end': string
}

function toCssSize(value: number | string) {
	return typeof value === 'number' ? `${value}px` : value
}

export function CarouselFade({
	size = 64,
	className,
	style,
	children,
	...props
}: CarouselFadeProps) {
	const { isReady, showStartFade, showEndFade } = useCarousel()
	const [canAnimate, setCanAnimate] = useState(false)

	useEffect(() => {
		if (!isReady) {
			setCanAnimate(false)
			return
		}

		const frameId = requestAnimationFrame(() => {
			setCanAnimate(true)
		})

		return () => cancelAnimationFrame(frameId)
	}, [isReady])

	const fadeSize = toCssSize(size)

	const fadeStyle: CarouselFadeStyle = {
		...style,
		'--carousel-fade-start': isReady && showStartFade ? fadeSize : '0px',
		'--carousel-fade-end': !isReady || showEndFade ? fadeSize : '0px',
	}

	return (
		<div
			{...props}
			data-animate={canAnimate ? '' : undefined}
			className={twMerge('carousel-fade w-full', className)}
			style={fadeStyle}
		>
			{children}
		</div>
	)
}
