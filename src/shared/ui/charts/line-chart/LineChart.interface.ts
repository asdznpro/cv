import type { ReactNode } from 'react'

import type { ChartConfig } from '../lib'
import type { EChartsRenderer } from '../lib/echarts'
import type {
	ChartAnimationType,
	ChartCurveType,
	ChartStrokeVariant,
	ChartXAxisProps,
	ChartYAxisProps,
} from '../cartesian'

export type LineChartStrokeVariant = ChartStrokeVariant
export type LineChartAnimationType = ChartAnimationType
export type LineChartCurveType = ChartCurveType
export type LineChartXAxisProps = ChartXAxisProps
export type LineChartYAxisProps = ChartYAxisProps

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
