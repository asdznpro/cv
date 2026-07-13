'use client'

import { twMerge } from 'tailwind-merge'

import type { CarouselDotsProps } from './Carousel.interface'
import { useCarousel } from './Carousel.context'

export function CarouselDots({ className, ...props }: CarouselDotsProps) {
	const { isReady, selectedIndex, scrollSnaps, scrollTo } = useCarousel()

	const rootClassName = twMerge('w-full flex justify-center gap-1.5', className)

	if (!isReady) {
		return (
			<div {...props} aria-hidden='true' className={rootClassName}>
				{[...Array(3)].map((_, index) => (
					<span
						key={index}
						className='h-1 w-8 rounded-full bg-foreground-tertiary/20 animate-pulse'
					/>
				))}
			</div>
		)
	}

	return (
		<div {...props} className={rootClassName}>
			{scrollSnaps.map((_, index) => {
				const selected = index === selectedIndex

				return (
					<button
						key={index}
						type='button'
						aria-label={`Go to slide ${index + 1}`}
						aria-current={selected ? 'true' : undefined}
						onClick={() => scrollTo(index)}
						className={twMerge(
							'max-w-8 w-full h-1 rounded-full',
							'cursor-pointer transition-colors duration-100',
							'focus-ring-base focus-ring-visible',
							selected
								? 'bg-foreground-secondary'
								: 'bg-foreground-tertiary/40 hover:bg-foreground-tertiary/80',
						)}
					/>
				)
			})}
		</div>
	)
}
