import type { ReactNode } from 'react'

import { readBrushSlot, type ChartBrushSlot } from '../brush'
import { readDotSlot, type ChartDotVariant } from '../dots'
import { readLegendSlot, type ChartLegendSlot } from '../legend'
import { findChartPart, findChartParts } from '../lib'
import { readTooltipSlot, type ChartTooltipSlot } from '../tooltip'
import { STROKE_WIDTH } from './line-chart.constants'
import type {
	LineChartAnimationType,
	LineChartCurveType,
	LineChartStrokeVariant,
} from './LineChart.interface'
import {
	LineChartGrid,
	LineChartLine,
	LineChartXAxis,
	LineChartYAxis,
} from './LineChart.parts'

export type CollectedLineSeries = {
	dataKey: string
	strokeVariant: LineChartStrokeVariant
	strokeWidth: number
	curveType?: LineChartCurveType
	animationType?: LineChartAnimationType
	connectNulls: boolean
	isClickable: boolean
	enableBufferLine: boolean
	dotVariant: ChartDotVariant
	activeDotVariant: ChartDotVariant
}

export type CollectedXAxisSlot = {
	present: boolean
	dataKey?: string
	tickFormatter?: (value: string, index: number) => string
	label?: string
	hideDots: boolean
}

export type CollectedYAxisSlot = {
	present: boolean
	dataKey?: string
	tickFormatter?: (value: number, index: number) => string
	label?: string
	hideDots: boolean
}

export type CollectedLineChartConfig = {
	lines: CollectedLineSeries[]
	xAxis: CollectedXAxisSlot
	yAxis: CollectedYAxisSlot
	showGrid: boolean
	tooltip: ChartTooltipSlot
	legend: ChartLegendSlot
	brush: ChartBrushSlot
}

export function collectLineChartConfig(
	children: ReactNode,
): CollectedLineChartConfig {
	const lineProps = findChartParts(children, LineChartLine)
	const lines: CollectedLineSeries[] = lineProps.map((props) => {
		const { variant, activeVariant } = readDotSlot(props.children)

		return {
			dataKey: props.dataKey,
			strokeVariant: props.strokeVariant ?? 'solid',
			strokeWidth: props.strokeWidth ?? STROKE_WIDTH,
			curveType: props.curveType,
			animationType: props.animationType,
			connectNulls: props.connectNulls ?? false,
			isClickable: props.isClickable ?? false,
			enableBufferLine: props.enableBufferLine ?? false,
			dotVariant: variant,
			activeDotVariant: activeVariant,
		}
	})

	const xAxisProps = findChartPart(children, LineChartXAxis)
	const yAxisProps = findChartPart(children, LineChartYAxis)

	return {
		lines,
		xAxis: {
			present: xAxisProps !== undefined,
			dataKey: xAxisProps?.dataKey,
			tickFormatter: xAxisProps?.tickFormatter,
			label: xAxisProps?.label,
			hideDots: xAxisProps?.hideDots ?? false,
		},
		yAxis: {
			present: yAxisProps !== undefined,
			dataKey: yAxisProps?.dataKey,
			tickFormatter: yAxisProps?.tickFormatter,
			label: yAxisProps?.label,
			hideDots: yAxisProps?.hideDots ?? false,
		},
		showGrid: findChartPart(children, LineChartGrid) !== undefined,
		tooltip: readTooltipSlot(children),
		legend: readLegendSlot(children),
		brush: readBrushSlot(children),
	}
}
