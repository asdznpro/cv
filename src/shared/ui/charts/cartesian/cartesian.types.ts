import type { ChartDotVariant } from '../dots'

export type ChartStrokeVariant = 'solid' | 'dashed' | 'animated-dashed'

export type ChartAnimationType =
	| 'none'
	| 'left-to-right'
	| 'right-to-left'
	| 'center-out'
	| 'edges-in'

export type ChartCurveType =
	| 'linear'
	| 'smooth'
	| 'bump'
	| 'monotone'
	| 'monotoneX'
	| 'monotoneY'
	| 'natural'
	| 'step'

export type ChartStackType = 'default' | 'stacked' | 'expanded'

export type CartesianSeriesBase = {
	dataKey: string
	strokeVariant: ChartStrokeVariant
	strokeWidth: number
	curveType?: ChartCurveType
	animationType?: ChartAnimationType
	connectNulls: boolean
	isClickable: boolean
	enableBufferLine: boolean
	dotVariant: ChartDotVariant
	activeDotVariant: ChartDotVariant
}

export interface ChartXAxisProps {
	dataKey?: string
	tickFormatter?: (value: string, index: number) => string
	label?: string
	hideDots?: boolean
}

export interface ChartYAxisProps {
	dataKey?: string
	tickFormatter?: (value: number, index: number) => string
	label?: string
	hideDots?: boolean
}
