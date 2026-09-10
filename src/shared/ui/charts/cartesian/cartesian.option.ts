import type { LineSeriesOption } from 'echarts/charts'
import type {
	DataZoomComponentOption,
	GridComponentOption,
	TooltipComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

import { buildBrushDataZoom } from '../brush'
import {
	flattenColor,
	getColorsCount,
	withAlpha,
	type ChartConfig,
	type ChartResolvedColors,
} from '../lib'
import {
	tooltipBaseOption,
	tooltipIndicatorHtml,
	tooltipRow,
	tooltipShell,
} from '../tooltip'
import type { ChartTooltipSlot } from '../tooltip'
import type { ChartLegendSlot } from '../legend'
import type { ChartBrushZoomRange } from '../brush'

import {
	AXIS_FONT_FAMILY,
	AXIS_POINTER_OPACITY,
	BRUSH_FILLER_OPACITY,
	BUFFER_PREFIX,
	GRID_LINE_OPACITY,
	LOADING_SHIMMER_BAND,
	LOADING_SHIMMER_FEATHER,
	STROKE_WIDTH,
} from './cartesian.constants'
import type {
	CollectedXAxisSlot,
	CollectedYAxisSlot,
} from './cartesian.collect'
import type { CartesianSeriesBase, ChartCurveType } from './cartesian.types'

export type CartesianChartOption = ComposeOption<
	| LineSeriesOption
	| GridComponentOption
	| TooltipComponentOption
	| DataZoomComponentOption
>

type ArrayItem<T> = T extends readonly (infer U)[] ? U : T
export type CartesianXAxisOption = ArrayItem<
	NonNullable<CartesianChartOption['xAxis']>
>
export type CartesianYAxisOption = ArrayItem<
	NonNullable<CartesianChartOption['yAxis']>
>

export type CartesianOptionContext<TSeries extends CartesianSeriesBase> = {
	data: Record<string, unknown>[]
	config: ChartConfig
	series: TSeries[]
	curveType: ChartCurveType
	isStacked: boolean
	isExpanded: boolean
	selectedDataKey: string | null
	hasSelection: boolean
	showGrid: boolean
	xAxisSlot: CollectedXAxisSlot
	yAxisSlot: CollectedYAxisSlot
	tooltipSlot: ChartTooltipSlot
	legendSlot: ChartLegendSlot
	isLoading: boolean
	loadingData: () => number[]
	showBrush: boolean
	brushHeight: number
	enableHoverHighlight: boolean
	enableHoverReveal: boolean
	revealIndex: number | null
	revealSink: Record<string, unknown[]>
	resolved: ChartResolvedColors
	rendererSize: { width: number; height: number }
	categories: string[]
	brushRange: ChartBrushZoomRange
	getHoveredKey: () => string | null
}

export function curveConfig(curveType: ChartCurveType): {
	smooth: boolean
	step: 'middle' | false
} {
	if (curveType === 'step') return { smooth: false, step: 'middle' }
	if (curveType === 'linear') return { smooth: false, step: false }
	return { smooth: true, step: false }
}

export function getLoadingData(points: number): number[] {
	const rows: number[] = []
	let value = 30 + Math.random() * 20
	for (let i = 0; i < points; i++) {
		value = Math.min(58, Math.max(16, value + (Math.random() - 0.5) * 16))
		rows.push(Math.round(value))
	}
	return rows
}

export function shimmerWindowStops(
	center: number,
	color: string,
	peak: number,
) {
	const half = LOADING_SHIMMER_BAND
	const feather = LOADING_SHIMMER_FEATHER

	const alphaAt = (x: number) => {
		const dist = Math.abs(x - center)
		if (dist <= half - feather) return peak
		if (dist >= half) return 0
		return (
			peak * Math.sin(((1 - (dist - (half - feather)) / feather) * Math.PI) / 2)
		)
	}

	const offsets = [
		0,
		center - half,
		center - half + feather,
		center,
		center + half - feather,
		center + half,
		1,
	]
		.filter(x => x >= 0 && x <= 1)
		.sort((a, b) => a - b)

	const stops: { offset: number; color: string }[] = []
	for (const offset of offsets) {
		if (stops.length === 0 || offset - stops[stops.length - 1].offset > 1e-4) {
			stops.push({ offset, color: withAlpha(color, alphaAt(offset)) })
		}
	}
	return stops
}

export function buildChartLayout({
	legendSlot,
	xAxisSlot,
	showBrush,
	brushHeight,
}: CartesianOptionContext<CartesianSeriesBase>): {
	grid: GridComponentOption
	brushBottom: number
} {
	const legendTop = legendSlot.present && legendSlot.verticalAlign === 'top'
	const legendBottom =
		legendSlot.present && legendSlot.verticalAlign === 'bottom'
	const brushGap = showBrush ? brushHeight + 30 + (xAxisSlot.label ? 22 : 0) : 0

	return {
		grid: {
			left: 8,
			right: 8,
			top: legendTop ? 42 : 16,
			bottom: 8 + brushGap + (legendBottom ? 34 : 0),
		},
		brushBottom: legendBottom ? 34 : 6,
	}
}

export function buildMainAxes(
	ctx: CartesianOptionContext<CartesianSeriesBase>,
): {
	xAxis: CartesianXAxisOption
	yAxis: CartesianYAxisOption
} {
	const {
		xAxisSlot,
		yAxisSlot,
		showGrid,
		isLoading,
		isExpanded,
		categories,
		loadingData,
	} = ctx
	const { tokens } = ctx.resolved

	const axisLabelColor = tokens.foregroundSecondary
	const splitLineColor = withAlpha(tokens.separator, GRID_LINE_OPACITY)
	const tickDotColor = flattenColor(splitLineColor, tokens.background)

	const xTickFormatter = xAxisSlot.tickFormatter
	const yTickFormatter = yAxisSlot.tickFormatter

	const axisLabelStyle = {
		color: axisLabelColor,
		fontSize: 10,
		fontFamily: AXIS_FONT_FAMILY,
	}

	const xAxis: CartesianXAxisOption = {
		type: 'category',
		boundaryGap: false,
		show: true,
		data: isLoading ? loadingData().map((_, i) => i) : categories,
		name: isLoading ? undefined : xAxisSlot.label,
		nameLocation: 'middle',
		nameGap: 30,
		nameTextStyle: axisLabelStyle,
		axisLine: { show: false },
		axisTick: {
			show: !isLoading && xAxisSlot.present && !xAxisSlot.hideDots,
			alignWithLabel: true,
			length: 0.5,
			lineStyle: { color: tickDotColor, width: 3, cap: 'round' },
		},
		splitLine: { show: false },
		axisLabel: {
			show: !isLoading && xAxisSlot.present,
			...axisLabelStyle,
			margin: 8,
			formatter: xTickFormatter
				? (value: string, index: number) => xTickFormatter(value, index)
				: undefined,
		},
	}

	const yAxis: CartesianYAxisOption = {
		type: 'value',
		show: yAxisSlot.present || showGrid,
		max: isExpanded ? 1 : undefined,
		name: isLoading ? undefined : yAxisSlot.label,
		nameLocation: 'middle',
		nameGap: 38,
		nameTextStyle: axisLabelStyle,
		axisLine: { show: false },
		axisTick: {
			show: yAxisSlot.present && !isLoading && !yAxisSlot.hideDots,
			length: 0.5,
			lineStyle: { color: tickDotColor, width: 3, cap: 'round' },
		},
		splitLine: {
			show: showGrid && !isLoading,
			lineStyle: {
				color: splitLineColor,
				type: [3, 3] as [number, number],
				width: 1,
			},
		},
		axisLabel: {
			show: yAxisSlot.present && !isLoading,
			...axisLabelStyle,
			margin: 8,
			formatter: isExpanded
				? (value: number) => `${Math.round(value * 100)}%`
				: yTickFormatter
					? (value: number, index: number) => yTickFormatter(value, index)
					: undefined,
		},
	}

	return { xAxis, yAxis }
}

function createTooltipFormatter(
	ctx: CartesianOptionContext<CartesianSeriesBase>,
) {
	const { config, selectedDataKey, tooltipSlot, getHoveredKey } = ctx

	return (params: unknown): string => {
		const rows = Array.isArray(params) ? params : [params]
		if (!rows.length) return ''

		const first = rows[0] as { axisValue?: string | number; name?: string }
		const axisValue = first.axisValue ?? first.name ?? ''
		const label = String(axisValue)

		const seen = new Set<string>()
		const body = rows
			.map(param => {
				const p = param as {
					seriesId?: string
					seriesName?: string
					value?: number | string | null
				}
				const rawId = String(p.seriesId ?? '')
				const key = rawId.startsWith(BUFFER_PREFIX)
					? rawId.slice(BUFFER_PREFIX.length)
					: rawId.startsWith('__')
						? ''
						: (p.seriesId ?? p.seriesName ?? '')
				if (!key) return ''
				if (p.value === null || p.value === undefined) return ''
				if (seen.has(key)) return ''
				seen.add(key)

				const item = config[key]
				const colorsCount = item ? getColorsCount(item) : 1
				const labelText =
					typeof item?.label === 'string' ? item.label : (p.seriesName ?? key)
				const hovered = getHoveredKey()
				const dimmed =
					(selectedDataKey != null && selectedDataKey !== key) ||
					(hovered != null && hovered !== key)

				const value =
					typeof p.value === 'number'
						? p.value.toLocaleString()
						: String(p.value ?? '')

				return tooltipRow({
					indicatorHtml: tooltipIndicatorHtml(key, colorsCount),
					labelText,
					valueText: value,
					dimmed,
				})
			})
			.join('')

		return tooltipShell({
			label,
			body,
			roundness: tooltipSlot.roundness,
		})
	}
}

export function buildTooltipOption(
	ctx: CartesianOptionContext<CartesianSeriesBase>,
): TooltipComponentOption {
	const { tooltipSlot, isLoading } = ctx
	const { tokens } = ctx.resolved

	return {
		...tooltipBaseOption({
			present: tooltipSlot.present && !isLoading,
			cursor: tooltipSlot.cursor,
			position: tooltipSlot.position,
			axisPointerColor: withAlpha(tokens.separator, AXIS_POINTER_OPACITY),
			strokeWidth: STROKE_WIDTH,
		}),
		formatter: createTooltipFormatter(ctx),
	}
}

export function buildBrushFrame(
	ctx: CartesianOptionContext<CartesianSeriesBase>,
	brushBottom: number,
): {
	miniGrid: GridComponentOption
	miniXAxis: CartesianXAxisOption
	miniYAxis: CartesianYAxisOption
	dataZoom: DataZoomComponentOption[]
} {
	const { brushHeight, categories } = ctx
	const { tokens } = ctx.resolved

	const miniGrid: GridComponentOption = {
		left: 8,
		right: 8,
		bottom: brushBottom,
		height: brushHeight,
		outerBoundsMode: 'none',
	}

	const miniXAxis: CartesianXAxisOption = {
		type: 'category',
		gridIndex: 1,
		boundaryGap: false,
		show: false,
		data: categories,
		axisPointer: { show: false },
	}

	const miniYAxis: CartesianYAxisOption = {
		type: 'value',
		gridIndex: 1,
		show: false,
	}

	const dataZoom = buildBrushDataZoom({
		brushBottom,
		brushHeight,
		brushRange: ctx.brushRange,
		fillerColor: withAlpha(tokens.foreground, BRUSH_FILLER_OPACITY),
	})

	return { miniGrid, miniXAxis, miniYAxis, dataZoom }
}

export function buildLoadingOption(
	ctx: CartesianOptionContext<CartesianSeriesBase>,
	frame: {
		grid: GridComponentOption
		xAxis: CartesianXAxisOption
		yAxis: CartesianYAxisOption
	},
	extra?: Partial<LineSeriesOption>,
): CartesianChartOption {
	const { tokens } = ctx.resolved
	const curve = curveConfig(ctx.curveType)

	return {
		animation: false,
		grid: frame.grid,
		xAxis: frame.xAxis,
		yAxis: frame.yAxis,
		tooltip: { show: false },
		series: [
			{
				id: '__loading',
				type: 'line',
				data: ctx.loadingData(),
				smooth: curve.smooth,
				step: curve.step,
				showSymbol: false,
				silent: true,
				lineStyle: { color: withAlpha(tokens.foreground, 0), width: 1 },
				z: 1,
				...extra,
			},
		],
	}
}

export function sliceToNull<T>(vals: readonly T[], idx: number): (T | null)[] {
	return vals.map((v, i) => (i > idx ? null : v))
}

export function sliceFrom<T>(vals: readonly T[], idx: number): (T | null)[] {
	return vals.map((v, i) => (i < idx ? null : v))
}

export function expandedValues(
	data: Record<string, unknown>[],
	seriesKeys: string[],
	isExpanded: boolean,
	key: string,
): number[] {
	const rowTotals = isExpanded
		? data.map(row =>
				seriesKeys.reduce(
					(sum, seriesKey) => sum + (Number(row[seriesKey]) || 0),
					0,
				),
			)
		: []

	return data.map((row, i) => {
		const value = Number(row[key]) || 0
		if (!isExpanded) return value
		const total = rowTotals[i]
		return total ? value / total : 0
	})
}
