'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
	EmblaCarouselType,
	EmblaEventType,
	EmblaPluginType,
} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import AutoScroll from 'embla-carousel-auto-scroll'

import { twMerge } from 'tailwind-merge'

import { CarouselContext, type CarouselContextValue } from './Carousel.context'
import type { CarouselRootProps } from './Carousel.interface'

export function CarouselRoot({
	options,
	autoplay = false,
	autoScroll = false,
	overflowing,
	className,
	children,
	...props
}: CarouselRootProps) {
	const plugins = useMemo<EmblaPluginType[]>(() => {
		const result: EmblaPluginType[] = []

		if (autoplay) {
			result.push(
				Autoplay({
					delay: 3200,
					stopOnInteraction: false,
					stopOnMouseEnter: true,
					...(typeof autoplay === 'object' ? autoplay : {}),
				}),
			)
		}

		if (autoScroll) {
			result.push(
				AutoScroll({
					speed: 1,
					startDelay: 1000,
					playOnInit: true,
					stopOnInteraction: false,
					stopOnMouseEnter: true,
					...(typeof autoScroll === 'object' ? autoScroll : {}),
				}),
			)
		}

		return result
	}, [autoplay, autoScroll])

	const [viewportRef, api] = useEmblaCarousel(options, plugins)

	const [selectedIndex, setSelectedIndex] = useState(0)
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	const [isReady, setIsReady] = useState(false)

	const [showStartFade, setShowStartFade] = useState(false)
	const [showEndFade, setShowEndFade] = useState(false)

	const loop = options?.loop ?? false

	const updateFadeEdges = useCallback(
		(emblaApi: EmblaCarouselType) => {
			const hasOverflow = overflowing ?? emblaApi.scrollSnapList().length > 1

			if (!hasOverflow) {
				setShowStartFade(false)
				setShowEndFade(false)
				return
			}

			if (loop) {
				setShowStartFade(true)
				setShowEndFade(true)
				return
			}

			const progress = Math.min(1, Math.max(0, emblaApi.scrollProgress()))

			const epsilon = 0.001

			setShowStartFade(progress > epsilon)
			setShowEndFade(progress < 1 - epsilon)
		},
		[loop, overflowing],
	)

	useEffect(() => {
		if (!api) return

		updateFadeEdges(api)

		api.on('scroll', updateFadeEdges)
		api.on('reInit', updateFadeEdges)

		return () => {
			api.off('scroll', updateFadeEdges)
			api.off('reInit', updateFadeEdges)
		}
	}, [api, updateFadeEdges])

	const updateState = useCallback((emblaApi: EmblaCarouselType) => {
		setSelectedIndex(emblaApi.selectedScrollSnap())
		setScrollSnaps(emblaApi.scrollSnapList())
		setCanScrollPrev(emblaApi.canScrollPrev())
		setCanScrollNext(emblaApi.canScrollNext())
		setIsReady(true)
	}, [])

	useEffect(() => {
		if (!api) return

		const events: EmblaEventType[] = ['select', 'reInit']

		updateState(api)
		events.forEach(event => api.on(event, updateState))

		return () => {
			events.forEach(event => api.off(event, updateState))
		}
	}, [api, updateState])

	const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
	const scrollNext = useCallback(() => api?.scrollNext(), [api])
	const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api])

	const value = useMemo<CarouselContextValue>(
		() => ({
			viewportRef,
			api,
			selectedIndex,
			scrollSnaps,
			canScrollPrev,
			canScrollNext,
			scrollPrev,
			scrollNext,
			scrollTo,
			isReady,
			showStartFade,
			showEndFade,
		}),
		[
			viewportRef,
			api,
			selectedIndex,
			scrollSnaps,
			canScrollPrev,
			canScrollNext,
			scrollPrev,
			scrollNext,
			scrollTo,
			isReady,
			showStartFade,
			showEndFade,
		],
	)

	return (
		<CarouselContext.Provider value={value}>
			<div
				{...props}
				role='region'
				aria-roledescription='carousel'
				className={twMerge(
					'relative max-w-full w-full min-w-0 flex flex-col items-center gap-app',
					className,
				)}
			>
				{children}
			</div>
		</CarouselContext.Provider>
	)
}
