'use client'

import { useMemo } from 'react'

import { CartesianChart, ChartGrid, ChartXAxis, ChartYAxis } from '../cartesian'
import { ChartBrush } from '../brush'
import { ChartActiveDot, ChartDot } from '../dots'
import { ChartLegend } from '../legend'
import { ChartTooltip } from '../tooltip'
import { collectAreaChartConfig } from './area-chart.collect'
import { areaChartAdapter } from './area-chart.option'
import type { AreaChartProps } from './AreaChart.interface'
import { AreaChartArea } from './AreaChart.parts'

function AreaChartRoot<TData extends Record<string, unknown>>({
	children,
	...props
}: AreaChartProps<TData>) {
	const collected = useMemo(() => collectAreaChartConfig(children), [children])
	const { areas, ...slots } = collected

	return (
		<CartesianChart
			{...props}
			series={areas}
			slots={slots}
			adapter={areaChartAdapter}
		/>
	)
}

export const AreaChart = Object.assign(AreaChartRoot, {
	Area: AreaChartArea,
	Dot: ChartDot,
	ActiveDot: ChartActiveDot,
	XAxis: ChartXAxis,
	YAxis: ChartYAxis,
	Grid: ChartGrid,
	Tooltip: ChartTooltip,
	Legend: ChartLegend,
	Brush: ChartBrush,
})
