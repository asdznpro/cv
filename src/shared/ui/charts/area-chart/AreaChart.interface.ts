import type { ReactNode } from 'react'

import type {
	ChartAnimationType,
	ChartCurveType,
	ChartStackType,
	ChartStrokeVariant,
	ChartXAxisProps,
	ChartYAxisProps,
} from '../cartesian'
import type { ChartConfig } from '../lib'
import type { EChartsRenderer } from '../lib/echarts'
import type { AreaChartFillVariant } from './area-chart.constants'

export type AreaChartStrokeVariant = ChartStrokeVariant
export type AreaChartAnimationType = ChartAnimationType
export type AreaChartCurveType = ChartCurveType
export type AreaChartStackType = ChartStackType
export type AreaChartXAxisProps = ChartXAxisProps
export type AreaChartYAxisProps = ChartYAxisProps
export type { AreaChartFillVariant }

export interface AreaChartProps<TData extends Record<string, unknown>> {
	data: TData[]
	config: ChartConfig
	renderer?: EChartsRenderer
	xDataKey?: keyof TData & string
	className?: string
	curveType?: AreaChartCurveType
	stackType?: AreaChartStackType
	animation?: boolean
	animationType?: AreaChartAnimationType
	enableHoverHighlight?: boolean
	enableHoverReveal?: boolean
	defaultSelectedDataKey?: string | null
	selectedDataKey?: string | null
	onSelectionChange?: (key: string | null) => void
	isLoading?: boolean
	loadingPoints?: number
	chartOptions?: Record<string, unknown>
	children?: ReactNode
}

export interface AreaChartAreaProps {
	dataKey: string
	variant?: AreaChartFillVariant
	strokeVariant?: AreaChartStrokeVariant
	strokeWidth?: number
	curveType?: AreaChartCurveType
	animationType?: AreaChartAnimationType
	connectNulls?: boolean
	isClickable?: boolean
	enableBufferLine?: boolean
	children?: ReactNode
}
