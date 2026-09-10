import type { LineSeriesOption } from 'echarts/charts'
import * as echarts from 'echarts/core'

import {
	BUFFER_DASH,
	BUFFER_PREFIX,
	BRUSH_STROKE_OPACITY,
	REVEAL_PREFIX,
	curveConfig,
	expandedValues,
	sliceFrom,
	sliceToNull,
	type CartesianChartAdapter,
	type CartesianOptionContext,
	type EChartsInstance,
} from '../cartesian'
import {
	dotItemStyle,
	dotStyle,
	sampleGradient,
	type ChartDotItemStyle,
} from '../dots'
import { seriesPaint, withAlpha as alpha } from '../lib'
import {
	BRUSH_FILL_OPACITY,
	BUFFERFILL_PREFIX,
	LOADING_SHIMMER_MAX_OPACITY,
} from './area-chart.constants'
import { fillPaint } from './area-chart.fill'
import type { CollectedAreaSeries } from './area-chart.collect'

type AreaPoint =
	| number
	| null
	| {
			value: number | null
			itemStyle: ChartDotItemStyle
			emphasis: { itemStyle: ChartDotItemStyle }
	  }

function getOpacity(selected: string | null, key: string) {
	if (selected === null || selected === key)
		return { fill: 0.8, stroke: 1, dot: 1 }
	return { fill: 0.1, stroke: 0.3, dot: 0.3 }
}

export function buildBrushMiniSeries(
	ctx: CartesianOptionContext<CollectedAreaSeries>,
): LineSeriesOption[] {
	const { data, series, curveType, isStacked, selectedDataKey } = ctx

	return series.map(area => {
		const key = area.dataKey
		const base = (ctx.resolved.series[key] ?? [])[0] ?? 'rgba(120, 120, 120, 1)'
		const curve = curveConfig(area.curveType ?? curveType)
		const opacity = getOpacity(selectedDataKey, key)
		const strokeDim = opacity.stroke
		const fillDim = opacity.fill / 0.8

		return {
			id: `__mini-${key}`,
			type: 'line',
			xAxisIndex: 1,
			yAxisIndex: 1,
			data: data.map(row => Number(row[key]) || 0),
			stack: isStacked ? '__mini-total' : undefined,
			smooth: curve.smooth,
			step: curve.step,
			connectNulls: area.connectNulls,
			silent: true,
			showSymbol: false,
			emphasis: { disabled: true },
			tooltip: { show: false },
			lineStyle: {
				color: base,
				width: 1,
				opacity: BRUSH_STROKE_OPACITY * strokeDim,
			},
			areaStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: alpha(base, BRUSH_FILL_OPACITY * fillDim),
					},
					{ offset: 1, color: alpha(base, 0) },
				]),
			},
			z: 0,
		}
	})
}

export function buildAreaSeries(
	ctx: CartesianOptionContext<CollectedAreaSeries>,
): LineSeriesOption[] {
	const {
		data,
		config,
		series,
		curveType,
		isStacked,
		isExpanded,
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
	const seriesKeys = series.map(area => area.dataKey)

	return series.flatMap((area): LineSeriesOption[] => {
		const key = area.dataKey
		const slots = resolved.series[key] ?? ['rgba(120, 120, 120, 1)']
		const paint = seriesPaint(slots)
		const isSelected = selectedDataKey === key
		const showUnselected = hasSelection && !isSelected
		const opacity = getOpacity(selectedDataKey, key)
		const curve = curveConfig(area.curveType ?? curveType)
		const multiColor = slots.length > 1

		const restingDot = dotStyle(area.dotVariant, paint, background)
		const activeDot = dotStyle(area.activeDotVariant, paint, background)
		const restingVisible = area.dotVariant !== 'none'
		const dotOpacity = opacity.dot

		const values = expandedValues(data, seriesKeys, isExpanded, key)
		const n = values.length
		const reveal = enableHoverReveal
		const buffer = !reveal && area.enableBufferLine && n >= 2
		const revealActive = reveal && revealIndex !== null

		const mainDash: 'solid' | [number, number] =
			buffer || area.strokeVariant === 'solid' ? 'solid' : [3, 3]

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

		const toPoints = (vals: (number | null)[]): AreaPoint[] =>
			!multiColor
				? vals
				: vals.map((value, i): AreaPoint => {
						if (value === null) return null
						const t = vals.length > 1 ? i / (vals.length - 1) : 0
						const pointColor = sampleGradient(slots, t)
						return {
							value,
							itemStyle: {
								...dotItemStyle(
									restingVisible ? area.dotVariant : area.activeDotVariant,
									pointColor,
									background,
								),
								opacity: dotOpacity,
							},
							emphasis: {
								itemStyle: {
									...dotItemStyle(
										area.activeDotVariant === 'none'
											? 'default'
											: area.activeDotVariant,
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
			stack: isStacked ? 'total' : undefined,
			smooth: curve.smooth,
			step: curve.step,
			connectNulls: area.connectNulls,
			cursor: area.isClickable ? 'pointer' : 'default',
			triggerEvent: area.isClickable,
			showSymbol: restingVisible,
			symbol: 'circle',
			symbolSize: restingVisible ? restingDot.size : activeDot.size,
			z,
			lineStyle: {
				color: strokePaint,
				width: area.strokeWidth,
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
			areaStyle: {
				color: fillPaint(area.fillVariant, showUnselected, slots, rendererSize),
				opacity: opacity.fill,
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
				areaStyle: { opacity: 0.1 },
				itemStyle: { opacity: 0.3 },
			},
		}

		if (reveal) {
			const muted = resolved.tokens.foregroundSecondary
			const revealBase: LineSeriesOption = {
				id: `${REVEAL_PREFIX}${key}`,
				type: 'line',
				data: revealActive ? sliceFrom(values, revealIndex as number) : values,
				stack: isStacked ? '__reveal-total' : undefined,
				smooth: curve.smooth,
				step: curve.step,
				connectNulls: false,
				silent: true,
				showSymbol: false,
				symbol: 'circle',
				z: z - 1,
				lineStyle: {
					color: muted,
					width: area.strokeWidth,
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
			stack: isStacked ? '__buffer-total' : undefined,
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
				width: area.strokeWidth,
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

		const bufferFillSeries: LineSeriesOption = {
			id: `${BUFFERFILL_PREFIX}${key}`,
			type: 'line',
			data: toPoints(bufferValues),
			stack: isStacked ? '__bufferfill-total' : undefined,
			smooth: curve.smooth,
			step: curve.step,
			connectNulls: true,
			silent: true,
			showSymbol: false,
			z: z - 1,
			lineStyle: { opacity: 0 },
			areaStyle: {
				color: fillPaint(area.fillVariant, showUnselected, slots, rendererSize),
				opacity: opacity.fill,
			},
			emphasis: { disabled: true },
			blur: { areaStyle: { opacity: 0.1 } },
			tooltip: { show: false },
		}

		return [mainSeries, bufferSeries, bufferFillSeries]
	})
}

export function computePlottedTops(
	ctx: CartesianOptionContext<CollectedAreaSeries>,
): Record<string, number[]> {
	const { data, series, isStacked, isExpanded } = ctx
	const seriesKeys = series.map(area => area.dataKey)
	const running = new Array(data.length).fill(0)
	const tops: Record<string, number[]> = {}

	for (const area of series) {
		const key = area.dataKey
		const values = expandedValues(data, seriesKeys, isExpanded, key)
		tops[key] = values.map((value, i) => {
			if (!isStacked) return value
			running[i] += value
			return running[i]
		})
	}

	return tops
}

export function resolveAreaAtPixel(
	chart: EChartsInstance,
	tops: Record<string, number[]>,
	keys: string[],
	x: number,
	y: number,
): string | null {
	if (keys.length < 2) return null
	if (!chart.containPixel({ gridIndex: 0 }, [x, y])) return null
	const [rawIndex] = chart.convertFromPixel({ gridIndex: 0 }, [x, y])
	const index = Math.round(rawIndex)

	let nearest: string | null = null
	let nearestDist = Infinity
	let above: string | null = null
	let abovePixelY = -Infinity
	for (const key of keys) {
		const value = tops[key]?.[index]
		if (value === undefined) continue
		const pixelY = chart.convertToPixel({ gridIndex: 0 }, [index, value])[1]
		const dist = Math.abs(pixelY - y)
		if (dist < nearestDist) {
			nearestDist = dist
			nearest = key
		}
		if (pixelY <= y && pixelY > abovePixelY) {
			abovePixelY = pixelY
			above = key
		}
	}
	return nearestDist <= 10 ? nearest : above
}

export const areaChartAdapter: CartesianChartAdapter<CollectedAreaSeries> = {
	hoverMode: 'band',
	companionIds: (area, { dataLength, enableHoverReveal }) => {
		const ids: string[] = []
		if (area.enableBufferLine && dataLength >= 2) {
			ids.push(
				`${BUFFER_PREFIX}${area.dataKey}`,
				`${BUFFERFILL_PREFIX}${area.dataKey}`,
			)
		}
		if (enableHoverReveal) ids.push(`${REVEAL_PREFIX}${area.dataKey}`)
		return ids
	},
	buildSeries: buildAreaSeries,
	buildBrushMiniSeries,
	loadingSeriesExtra: ctx => ({
		areaStyle: { color: alpha(ctx.resolved.tokens.foreground, 0) },
	}),
	loadingShimmerExtra: clip => ({
		areaStyle: { color: clip(LOADING_SHIMMER_MAX_OPACITY) },
	}),
	computePlottedTops,
	resolvePointerKey: resolveAreaAtPixel,
}
