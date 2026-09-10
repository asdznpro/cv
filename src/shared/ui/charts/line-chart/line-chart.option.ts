import type { LineSeriesOption } from 'echarts/charts'
import type {
	DataZoomComponentOption,
	GridComponentOption,
	TooltipComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import * as echarts from 'echarts/core'

import { buildBrushDataZoom } from '../brush'
import {
	dotItemStyle,
	dotStyle,
	sampleGradient,
	type ChartDotItemStyle,
} from '../dots'
import {
	flattenColor,
	getColorsCount,
	seriesPaint,
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
	BRUSH_STROKE_OPACITY,
	BUFFER_DASH,
	BUFFER_PREFIX,
	GRID_LINE_OPACITY,
	LOADING_SHIMMER_BAND,
	LOADING_SHIMMER_FEATHER,
	REVEAL_PREFIX,
	STROKE_WIDTH,
} from './line-chart.constants'
import type {
	CollectedLineSeries,
	CollectedXAxisSlot,
	CollectedYAxisSlot,
} from './line-chart.collect'
import type { LineChartCurveType } from './LineChart.interface'

export type LineChartOption = ComposeOption<
	| LineSeriesOption
	| GridComponentOption
	| TooltipComponentOption
	| DataZoomComponentOption
>

type ArrayItem<T> = T extends readonly (infer U)[] ? U : T
type XAxisOption = ArrayItem<NonNullable<LineChartOption['xAxis']>>
type YAxisOption = ArrayItem<NonNullable<LineChartOption['yAxis']>>

type LinePoint =
	| number
	| null
	| {
			value: number | null
			itemStyle: ChartDotItemStyle
			emphasis: { itemStyle: ChartDotItemStyle }
	  }

export type LineChartOptionBuildContext = {
	data: Record<string, unknown>[]
	config: ChartConfig
	lines: CollectedLineSeries[]
	curveType: LineChartCurveType
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

function curveConfig(curveType: LineChartCurveType): {
	smooth: boolean
	step: 'middle' | false
} {
	if (curveType === 'step') return { smooth: false, step: 'middle' }
	if (curveType === 'linear') return { smooth: false, step: false }
	return { smooth: true, step: false }
}

function getOpacity(selected: string | null, key: string) {
	if (selected === null || selected === key) return { stroke: 1, dot: 1 }
	return { stroke: 0.3, dot: 0.3 }
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
		.filter((x) => x >= 0 && x <= 1)
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
}: LineChartOptionBuildContext): {
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

export function buildMainAxes(ctx: LineChartOptionBuildContext): {
	xAxis: XAxisOption
	yAxis: YAxisOption
} {
	const { xAxisSlot, yAxisSlot, showGrid, isLoading, categories, loadingData } =
		ctx
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

	const xAxis: XAxisOption = {
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

	const yAxis: YAxisOption = {
		type: 'value',
		show: yAxisSlot.present || showGrid,
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
			formatter: yTickFormatter
				? (value: number, index: number) => yTickFormatter(value, index)
				: undefined,
		},
	}

	return { xAxis, yAxis }
}

function createTooltipFormatter(ctx: LineChartOptionBuildContext) {
	const { config, selectedDataKey, tooltipSlot, getHoveredKey } = ctx

	return (params: unknown): string => {
		const rows = Array.isArray(params) ? params : [params]
		if (!rows.length) return ''

		const first = rows[0] as { axisValue?: string | number; name?: string }
		const axisValue = first.axisValue ?? first.name ?? ''
		const label = String(axisValue)

		const seen = new Set<string>()
		const body = rows
			.map((param) => {
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
	ctx: LineChartOptionBuildContext,
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

export function buildBrushOption(
	ctx: LineChartOptionBuildContext,
	brushBottom: number,
): {
	miniGrid: GridComponentOption
	miniXAxis: XAxisOption
	miniYAxis: YAxisOption
	miniSeries: LineSeriesOption[]
	dataZoom: DataZoomComponentOption[]
} {
	const { data, lines, curveType, selectedDataKey, brushHeight, categories } =
		ctx
	const { tokens } = ctx.resolved

	const miniGrid: GridComponentOption = {
		left: 8,
		right: 8,
		bottom: brushBottom,
		height: brushHeight,
		outerBoundsMode: 'none',
	}

	const miniXAxis: XAxisOption = {
		type: 'category',
		gridIndex: 1,
		boundaryGap: false,
		show: false,
		data: categories,
		axisPointer: { show: false },
	}

	const miniYAxis: YAxisOption = { type: 'value', gridIndex: 1, show: false }

	const miniSeries: LineSeriesOption[] = lines.map((line) => {
		const key = line.dataKey
		const base = (ctx.resolved.series[key] ?? [])[0] ?? 'rgba(120, 120, 120, 1)'
		const curve = curveConfig(line.curveType ?? curveType)
		const strokeDim = getOpacity(selectedDataKey, key).stroke

		return {
			id: `__mini-${key}`,
			type: 'line',
			xAxisIndex: 1,
			yAxisIndex: 1,
			data: data.map((row) => Number(row[key]) || 0),
			smooth: curve.smooth,
			step: curve.step,
			connectNulls: line.connectNulls,
			silent: true,
			showSymbol: false,
			emphasis: { disabled: true },
			tooltip: { show: false },
			lineStyle: {
				color: base,
				width: 1,
				opacity: BRUSH_STROKE_OPACITY * strokeDim,
			},
			z: 0,
		}
	})

	const dataZoom = buildBrushDataZoom({
		brushBottom,
		brushHeight,
		brushRange: ctx.brushRange,
		fillerColor: withAlpha(tokens.foreground, BRUSH_FILLER_OPACITY),
	})

	return { miniGrid, miniXAxis, miniYAxis, miniSeries, dataZoom }
}

export function buildLoadingOption(
	ctx: LineChartOptionBuildContext,
	frame: { grid: GridComponentOption; xAxis: XAxisOption; yAxis: YAxisOption },
): LineChartOption {
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

export function buildLineSeries(
	ctx: LineChartOptionBuildContext,
): LineSeriesOption[] {
	const {
		data,
		config,
		lines,
		curveType,
		selectedDataKey,
		hasSelection,
		enableHoverHighlight,
		enableHoverReveal,
		revealIndex,
		revealSink,
		resolved,
		rendererSize,
	} = ctx
	const background = resolved.tokens.background

	return lines.flatMap((line): LineSeriesOption[] => {
		const key = line.dataKey
		const slots = resolved.series[key] ?? ['rgba(120, 120, 120, 1)']
		const paint = seriesPaint(slots)
		const isSelected = selectedDataKey === key
		const opacity = getOpacity(selectedDataKey, key)
		const curve = curveConfig(line.curveType ?? curveType)
		const multiColor = slots.length > 1

		const restingDot = dotStyle(line.dotVariant, paint, background)
		const activeDot = dotStyle(line.activeDotVariant, paint, background)
		const restingVisible = line.dotVariant !== 'none'
		const dotOpacity = opacity.dot

		const values = data.map((row) => Number(row[key]) || 0)
		const n = values.length
		const reveal = enableHoverReveal
		const buffer = !reveal && line.enableBufferLine && n >= 2
		const revealActive = reveal && revealIndex !== null

		const mainDash: 'solid' | [number, number] =
			buffer || line.strokeVariant === 'solid' ? 'solid' : [3, 3]

		const strokePaint =
			reveal && multiColor
				? new echarts.graphic.LinearGradient(
						8,
						0,
						Math.max(rendererSize.width - 8, 9),
						0,
						slots.map((color, i) => ({
							offset: i / (slots.length - 1),
							color,
						})),
						true,
					)
				: paint

		const toPoints = (vals: (number | null)[]): LinePoint[] =>
			!multiColor
				? vals
				: vals.map((value, i): LinePoint => {
						if (value === null) return null
						const t = vals.length > 1 ? i / (vals.length - 1) : 0
						const pointColor = sampleGradient(slots, t)
						return {
							value,
							itemStyle: {
								...dotItemStyle(
									restingVisible ? line.dotVariant : line.activeDotVariant,
									pointColor,
									background,
								),
								opacity: dotOpacity,
							},
							emphasis: {
								itemStyle: {
									...dotItemStyle(
										line.activeDotVariant === 'none'
											? 'default'
											: line.activeDotVariant,
										pointColor,
										background,
									),
									opacity: 1,
								},
							},
						}
					})

		if (reveal) revealSink[key] = toPoints(values)

		const mainValues: (number | null)[] = buffer
			? values.map((v, i) => (i === n - 1 ? null : v))
			: revealActive
				? sliceToNull(values, revealIndex as number)
				: values

		const z = isSelected ? 3 : hasSelection ? 1 : 2

		const mainSeries: LineSeriesOption = {
			id: key,
			name: typeof config[key]?.label === 'string' ? config[key]?.label : key,
			type: 'line',
			data: toPoints(mainValues),
			smooth: curve.smooth,
			step: curve.step,
			connectNulls: line.connectNulls,
			cursor: line.isClickable ? 'pointer' : 'default',
			triggerEvent: line.isClickable,
			showSymbol: restingVisible,
			symbol: 'circle',
			symbolSize: restingVisible ? restingDot.size : activeDot.size,
			z,
			lineStyle: {
				color: strokePaint,
				width: line.strokeWidth,
				opacity: opacity.stroke,
				type: mainDash,
				dashOffset: 0,
			},
			itemStyle: multiColor
				? { opacity: dotOpacity }
				: {
						...(restingVisible ? restingDot.itemStyle : activeDot.itemStyle),
						opacity: dotOpacity,
					},
			emphasis: {
				focus:
					enableHoverHighlight && !enableHoverReveal && !hasSelection
						? 'series'
						: 'none',
				scale: restingVisible
					? activeDot.size / Math.max(restingDot.size, 1)
					: 1,
				...(multiColor
					? {}
					: { itemStyle: { ...activeDot.itemStyle, opacity: 1 } }),
			},
			blur: {
				lineStyle: { opacity: 0.3 },
				itemStyle: { opacity: 0.3 },
			},
		}

		if (reveal) {
			const muted = resolved.tokens.foregroundSecondary
			const revealBase: LineSeriesOption = {
				id: `${REVEAL_PREFIX}${key}`,
				type: 'line',
				data: revealActive ? sliceFrom(values, revealIndex as number) : values,
				smooth: curve.smooth,
				step: curve.step,
				connectNulls: false,
				silent: true,
				showSymbol: false,
				symbol: 'circle',
				z: z - 1,
				lineStyle: {
					color: muted,
					width: line.strokeWidth,
					type: mainDash,
					opacity: revealActive ? 0.3 : 0,
				},
				emphasis: { disabled: true },
				blur: { lineStyle: { opacity: revealActive ? 0.3 : 0 } },
				tooltip: { show: false },
			}
			return [revealBase, mainSeries]
		}

		if (!buffer) return [mainSeries]

		const bufferValues: (number | null)[] = values.map((v, i) =>
			i >= n - 2 ? v : null,
		)
		const bufferSeries: LineSeriesOption = {
			id: `${BUFFER_PREFIX}${key}`,
			type: 'line',
			data: toPoints(bufferValues),
			smooth: curve.smooth,
			step: curve.step,
			connectNulls: true,
			silent: true,
			showSymbol: restingVisible,
			symbol: 'circle',
			symbolSize: restingVisible ? restingDot.size : activeDot.size,
			z,
			lineStyle: {
				color: paint,
				width: line.strokeWidth,
				opacity: opacity.stroke,
				type: BUFFER_DASH,
			},
			itemStyle: multiColor
				? { opacity: dotOpacity }
				: {
						...(restingVisible ? restingDot.itemStyle : activeDot.itemStyle),
						opacity: dotOpacity,
					},
			emphasis: {
				focus: 'none',
				scale: false,
				lineStyle: { opacity: opacity.stroke },
				itemStyle: { opacity: dotOpacity },
			},
			blur: { lineStyle: { opacity: 0.3 }, itemStyle: { opacity: 0.3 } },
		}

		return [mainSeries, bufferSeries]
	})
}
