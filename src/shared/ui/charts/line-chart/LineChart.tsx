'use client'

import { useMemo } from 'react'

import { CartesianChart, ChartGrid, ChartXAxis, ChartYAxis } from '../cartesian'
import { ChartBrush } from '../brush'
import { ChartActiveDot, ChartDot } from '../dots'
import { ChartLegend } from '../legend'
import { ChartTooltip } from '../tooltip'
import { collectLineChartConfig } from './line-chart.collect'
import { lineChartAdapter } from './line-chart.option'
import type { LineChartProps } from './LineChart.interface'
import { LineChartLine } from './LineChart.parts'

function LineChartRoot<TData extends Record<string, unknown>>({
	children,
	...props
}: LineChartProps<TData>) {
	const collected = useMemo(() => collectLineChartConfig(children), [children])
	const { lines, ...slots } = collected

	return (
		<CartesianChart
			{...props}
			series={lines}
			slots={slots}
			adapter={lineChartAdapter}
		/>
	)
}

export const LineChart = Object.assign(LineChartRoot, {
	Line: LineChartLine,
	Dot: ChartDot,
	ActiveDot: ChartActiveDot,
	XAxis: ChartXAxis,
	YAxis: ChartYAxis,
	Grid: ChartGrid,
	Tooltip: ChartTooltip,
	Legend: ChartLegend,
	Brush: ChartBrush,
})
