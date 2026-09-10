import { Children, isValidElement, type FC, type ReactNode } from 'react'

import type { ChartDotProps, ChartDotSlot } from './ChartDot.interface'

export const ChartDot: FC<ChartDotProps> = () => null
ChartDot.displayName = 'ChartDot'

export const ChartActiveDot: FC<ChartDotProps> = () => null
ChartActiveDot.displayName = 'ChartActiveDot'

export const DEFAULT_DOT_SLOT: ChartDotSlot = {
	variant: 'none',
	activeVariant: 'none',
}

export function readDotSlot(children: ReactNode): ChartDotSlot {
	let variant: ChartDotSlot['variant'] = 'none'
	let activeVariant: ChartDotSlot['activeVariant'] = 'none'

	Children.forEach(children, (child) => {
		if (!isValidElement(child)) return
		if (child.type === ChartDot) {
			variant = (child.props as ChartDotProps).variant ?? 'default'
		} else if (child.type === ChartActiveDot) {
			activeVariant = (child.props as ChartDotProps).variant ?? 'default'
		}
	})

	return { variant, activeVariant }
}
