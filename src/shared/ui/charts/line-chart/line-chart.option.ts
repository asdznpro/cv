import type { LineSeriesOption } from 'echarts/charts'
import * as echarts from 'echarts/core'

import {
	BUFFER_DASH,
	BUFFER_PREFIX,
	BRUSH_STROKE_OPACITY,
	REVEAL_PREFIX,
	curveConfig,
	sliceFrom,
	sliceToNull,
	type CartesianChartAdapter,
	type CartesianOptionContext,
} from '../cartesian'
import {
	dotItemStyle,
	dotStyle,
	sampleGradient,
	type ChartDotItemStyle,
} from '../dots'
import { seriesPaint as paintSlots } from '../lib'
import type { CollectedLineSeries } from './line-chart.collect'

type LinePoint =
	| number
	| null
	| {
			value: number | null
			itemStyle: ChartDotItemStyle
			emphasis: { itemStyle: ChartDotItemStyle }
	  }

function getOpacity(selected: string | null, key: string) {
	if (selected === null || selected === key) return { stroke: 1, dot: 1 }
	return { stroke: 0.3, dot: 0.3 }
}

export function buildBrushMiniSeries(
	ctx: CartesianOptionContext<CollectedLineSeries>,
): LineSeriesOption[] {
	const { data, series, curveType, selectedDataKey } = ctx

	return series.map(line => {
		const key = line.dataKey
		const base = (ctx.resolved.series[key] ?? [])[0] ?? 'rgba(120, 120, 120, 1)'
		const curve = curveConfig(line.curveType ?? curveType)
		const strokeDim = getOpacity(selectedDataKey, key).stroke

		return {
			id: `__mini-${key}`,
			type: 'line',
			xAxisIndex: 1,
			yAxisIndex: 1,
			data: data.map(row => Number(row[key]) || 0),
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
}

export function buildLineSeries(
	ctx: CartesianOptionContext<CollectedLineSeries>,
): LineSeriesOption[] {
	const {
		data,
		config,
		series,
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

	return series.flatMap((line): LineSeriesOption[] => {
		const key = line.dataKey
		const slots = resolved.series[key] ?? ['rgba(120, 120, 120, 1)']
		const paint = paintSlots(slots)
		const isSelected = selectedDataKey === key
		const opacity = getOpacity(selectedDataKey, key)
		const curve = curveConfig(line.curveType ?? curveType)
		const multiColor = slots.length > 1

		const restingDot = dotStyle(line.dotVariant, paint, background)
		const activeDot = dotStyle(line.activeDotVariant, paint, background)
		const restingVisible = line.dotVariant !== 'none'
		const dotOpacity = opacity.dot

		const values = data.map(row => Number(row[key]) || 0)
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

export const lineChartAdapter: CartesianChartAdapter<CollectedLineSeries> = {
	hoverMode: 'series',
	companionIds: (line, { dataLength, enableHoverReveal }) => {
		const ids: string[] = []
		if (line.enableBufferLine && dataLength >= 2) {
			ids.push(`${BUFFER_PREFIX}${line.dataKey}`)
		}
		if (enableHoverReveal) ids.push(`${REVEAL_PREFIX}${line.dataKey}`)
		return ids
	},
	buildSeries: buildLineSeries,
	buildBrushMiniSeries,
}
