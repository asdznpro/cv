'use client'

import { CarouselRoot } from './CarouselRoot'
import { CarouselFade } from './CarouselFade'
import {
	CarouselContent,
	CarouselItem,
	CarouselViewport,
} from './CarouselLayout'
import { CarouselNext, CarouselPrevious } from './CarouselNavigation'
import { CarouselDots } from './CarouselDots'

export const Carousel = {
	Root: CarouselRoot,
	Fade: CarouselFade,
	Viewport: CarouselViewport,
	Content: CarouselContent,
	Item: CarouselItem,
	Previous: CarouselPrevious,
	Next: CarouselNext,
	Dots: CarouselDots,
}
