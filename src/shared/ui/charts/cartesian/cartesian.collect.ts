import type { ReactNode } from 'react'

import { readBrushSlot, type ChartBrushSlot } from '../brush'
import { readLegendSlot, type ChartLegendSlot } from '../legend'
import { findChartPart } from '../lib'
import { readTooltipSlot, type ChartTooltipSlot } from '../tooltip'
import { ChartGrid, ChartXAxis, ChartYAxis } from './CartesianChart.parts'
import type { ChartXAxisProps, ChartYAxisProps } from './cartesian.types'

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

export type CollectedCartesianSlots = {
	xAxis: CollectedXAxisSlot
	yAxis: CollectedYAxisSlot
	showGrid: boolean
	tooltip: ChartTooltipSlot
	legend: ChartLegendSlot
	brush: ChartBrushSlot
}

function collectXAxis(props: ChartXAxisProps | undefined): CollectedXAxisSlot {
	return {
		present: props !== undefined,
		dataKey: props?.dataKey,
		tickFormatter: props?.tickFormatter,
		label: props?.label,
		hideDots: props?.hideDots ?? false,
	}
}

function collectYAxis(props: ChartYAxisProps | undefined): CollectedYAxisSlot {
	return {
		present: props !== undefined,
		dataKey: props?.dataKey,
		tickFormatter: props?.tickFormatter,
		label: props?.label,
		hideDots: props?.hideDots ?? false,
	}
}

export function collectCartesianSlots(
	children: ReactNode,
): CollectedCartesianSlots {
	return {
		xAxis: collectXAxis(findChartPart(children, ChartXAxis)),
		yAxis: collectYAxis(findChartPart(children, ChartYAxis)),
		showGrid: findChartPart(children, ChartGrid) !== undefined,
		tooltip: readTooltipSlot(children),
		legend: readLegendSlot(children),
		brush: readBrushSlot(children),
	}
}
