'use client'

import { twMerge } from 'tailwind-merge'
import {
	Icon28ArrowLeftOutline,
	Icon28ArrowRightOutline,
} from '@vkontakte/icons'

import type { CarouselButtonProps } from './Carousel.interface'
import { useCarousel } from './Carousel.context'

import { Button } from 'ui/blocks'

function CarouselPrevious({
	className,
	children,
	...props
}: CarouselButtonProps) {
	const { canScrollPrev, scrollPrev } = useCarousel()

	return (
		<Button
			{...props}
			type='button'
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			aria-label='Previous slide'
			className={twMerge(
				'absolute top-1/2 left-app -translate-y-1/2',
				!canScrollPrev ? 'scale-0' : 'scale-100',
				className,
			)}
			size='sm'
			appearance='neutral'
			prefix={children ?? <Icon28ArrowLeftOutline width={20} height={20} />}
			radius='rounded'
			iconOnly
		/>
	)
}

function CarouselNext({ className, children, ...props }: CarouselButtonProps) {
	const { canScrollNext, scrollNext } = useCarousel()

	return (
		<Button
			{...props}
			type='button'
			disabled={!canScrollNext}
			onClick={scrollNext}
			aria-label='Next slide'
			className={twMerge(
				'absolute top-1/2 right-app -translate-y-1/2',
				!canScrollNext ? 'scale-0' : 'scale-100',
				className,
			)}
			size='sm'
			appearance='neutral'
			prefix={children ?? <Icon28ArrowRightOutline width={20} height={20} />}
			radius='rounded'
			iconOnly
		/>
	)
}

export { CarouselPrevious, CarouselNext }
