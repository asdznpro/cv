import type { CSSProperties } from 'react'
import type { VariantProps } from 'class-variance-authority'

import type { ChartConfig } from '../lib/types'
import type { legendIndicatorVariants } from './legend.variants'

export type ChartLegendVariant = NonNullable<
	VariantProps<typeof legendIndicatorVariants>['variant']
>
export type ChartLegendAlign = 'left' | 'center' | 'right'
export type ChartLegendVerticalAlign = 'top' | 'middle' | 'bottom'

export interface ChartLegendProps {
	variant?: ChartLegendVariant
	align?: ChartLegendAlign
	verticalAlign?: ChartLegendVerticalAlign
	isClickable?: boolean
}

export interface ChartLegendSlot {
	present: boolean
	variant: ChartLegendVariant
	align: ChartLegendAlign
	verticalAlign: ChartLegendVerticalAlign
	isClickable: boolean
}

export interface ChartLegendIndicatorProps {
	variant: ChartLegendVariant
	dataKey: string
	colorsCount: number
}

export interface ChartLegendOverlayProps {
	seriesKeys: string[]
	config: ChartConfig
	variant: ChartLegendVariant
	align: ChartLegendAlign
	verticalAlign: ChartLegendVerticalAlign
	selectedKey: string | null
	hoveredKey: string | null
	isClickable: boolean
	onToggle: (key: string) => void
	style: CSSProperties
}
