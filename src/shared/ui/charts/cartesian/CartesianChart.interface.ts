import type { LineSeriesOption } from 'echarts/charts'
import type { ReactNode } from 'react'
import type * as echarts from 'echarts/core'

import type { ChartConfig } from '../lib'
import type { EChartsRenderer } from '../lib/echarts'
import type { CollectedCartesianSlots } from './cartesian.collect'
import type {
	CartesianOptionContext,
	CartesianChartOption,
} from './cartesian.option'
import type {
	CartesianSeriesBase,
	ChartAnimationType,
	ChartCurveType,
	ChartStackType,
} from './cartesian.types'

export type EChartsInstance = ReturnType<typeof echarts.init>

export type CartesianHoverMode = 'series' | 'band'

export type CartesianChartAdapter<TSeries extends CartesianSeriesBase> = {
	hoverMode: CartesianHoverMode
	companionIds: (
		series: TSeries,
		opts: { dataLength: number; enableHoverReveal: boolean },
	) => string[]
	buildSeries: (ctx: CartesianOptionContext<TSeries>) => LineSeriesOption[]
	buildBrushMiniSeries: (
		ctx: CartesianOptionContext<TSeries>,
	) => LineSeriesOption[]
	loadingSeriesExtra?: (
		ctx: CartesianOptionContext<TSeries>,
	) => Partial<LineSeriesOption>
	loadingShimmerExtra?: (
		clip: (peak: number) => echarts.graphic.LinearGradient,
	) => Record<string, unknown>
	computePlottedTops?: (
		ctx: CartesianOptionContext<TSeries>,
	) => Record<string, number[]>
	resolvePointerKey?: (
		chart: EChartsInstance,
		plottedTops: Record<string, number[]>,
		keys: string[],
		x: number,
		y: number,
	) => string | null
}

export interface CartesianChartProps<
	TData extends Record<string, unknown>,
	TSeries extends CartesianSeriesBase,
> {
	data: TData[]
	config: ChartConfig
	renderer?: EChartsRenderer
	xDataKey?: keyof TData & string
	className?: string
	curveType?: ChartCurveType
	stackType?: ChartStackType
	animation?: boolean
	animationType?: ChartAnimationType
	enableHoverHighlight?: boolean
	enableHoverReveal?: boolean
	defaultSelectedDataKey?: string | null
	selectedDataKey?: string | null
	onSelectionChange?: (key: string | null) => void
	isLoading?: boolean
	loadingPoints?: number
	chartOptions?: Record<string, unknown>
	children?: ReactNode
	series: TSeries[]
	slots: CollectedCartesianSlots
	adapter: CartesianChartAdapter<TSeries>
}

export type { CartesianChartOption }
