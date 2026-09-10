import type { VariantProps } from 'class-variance-authority'

import type { tooltipSurfaceVariants } from './tooltip.variants'

export type ChartTooltipRoundness = NonNullable<
	VariantProps<typeof tooltipSurfaceVariants>['roundness']
>
export type ChartTooltipPosition = 'variable' | 'fixed'

export interface ChartTooltipProps {
	roundness?: ChartTooltipRoundness
	position?: ChartTooltipPosition
	cursor?: boolean
	defaultIndex?: number
}

export interface ChartTooltipSlot {
	present: boolean
	roundness: ChartTooltipRoundness
	cursor: boolean
	position: ChartTooltipPosition
	defaultIndex?: number
}
