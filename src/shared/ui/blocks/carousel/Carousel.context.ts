'use client'

import { createContext, useContext } from 'react'

import type { EmblaCarouselType } from 'embla-carousel'
import type { EmblaViewportRefType } from 'embla-carousel-react'

export interface CarouselContextValue {
	viewportRef: EmblaViewportRefType
	api?: EmblaCarouselType
	selectedIndex: number
	scrollSnaps: number[]
	canScrollPrev: boolean
	canScrollNext: boolean
	scrollPrev: () => void
	scrollNext: () => void
	scrollTo: (index: number) => void

	isReady: boolean

	showStartFade: boolean
	showEndFade: boolean
}

export const CarouselContext = createContext<CarouselContextValue | null>(null)

export function useCarousel() {
	const context = useContext(CarouselContext)

	if (!context) {
		throw new Error('Carousel components must be rendered inside Carousel.Root')
	}

	return context
}
