import type { ReactNode } from 'react'

import type { ChartConfig } from '../lib'
import type { EChartsRenderer } from '../lib/echarts'

export type LineChartStrokeVariant = 'solid' | 'dashed' | 'animated-dashed'

export type LineChartAnimationType =
	| 'none'
	| 'left-to-right'
	| 'right-to-left'
	| 'center-out'
	| 'edges-in'

export type LineChartCurveType =
	| 'linear'
	| 'smooth'
	| 'bump'
	| 'monotone'
	| 'monotoneX'
	| 'monotoneY'
	| 'natural'
	| 'step'

export interface LineChartProps<TData extends Record<string, unknown>> {
	data: TData[]
	config: ChartConfig
	renderer?: EChartsRenderer
	xDataKey?: keyof TData & string
	className?: string
	curveType?: LineChartCurveType
	animation?: boolean
	animationType?: LineChartAnimationType
	enableHoverHighlight?: boolean
	enableHoverReveal?: boolean
	defaultSelectedDataKey?: string | null
	onSelectionChange?: (key: string | null) => void
	isLoading?: boolean
	loadingPoints?: number
	chartOptions?: Record<string, unknown>
	children?: ReactNode
}

export interface LineChartLineProps {
	dataKey: string
	strokeVariant?: LineChartStrokeVariant
	strokeWidth?: number
	curveType?: LineChartCurveType
	animationType?: LineChartAnimationType
	connectNulls?: boolean
	isClickable?: boolean
	enableBufferLine?: boolean
	children?: ReactNode
}

export interface LineChartXAxisProps {
	dataKey?: string
	tickFormatter?: (value: string, index: number) => string
	label?: string
	hideDots?: boolean
}

export interface LineChartYAxisProps {
	dataKey?: string
	tickFormatter?: (value: number, index: number) => string
	label?: string
	hideDots?: boolean
}
