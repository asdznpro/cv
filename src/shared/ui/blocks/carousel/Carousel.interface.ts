import type { ComponentPropsWithoutRef } from 'react'

import type { EmblaOptionsType } from 'embla-carousel'
import type { AutoplayOptionsType } from 'embla-carousel-autoplay'
import type { AutoScrollOptionsType } from 'embla-carousel-auto-scroll'

export interface CarouselRootProps extends ComponentPropsWithoutRef<'div'> {
	options?: EmblaOptionsType
	autoplay?: boolean | AutoplayOptionsType
	autoScroll?: boolean | AutoScrollOptionsType
	overflowing?: boolean
}
export type CarouselViewportProps = Omit<ComponentPropsWithoutRef<'div'>, 'ref'>

export type CarouselContentProps = ComponentPropsWithoutRef<'div'>
export type CarouselItemProps = ComponentPropsWithoutRef<'div'>
export type CarouselButtonProps = ComponentPropsWithoutRef<'button'>
export type CarouselDotsProps = ComponentPropsWithoutRef<'div'>
