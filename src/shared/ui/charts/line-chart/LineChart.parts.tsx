import type { FC } from 'react'

import type {
	LineChartLineProps,
	LineChartXAxisProps,
	LineChartYAxisProps,
} from './LineChart.interface'

export const LineChartLine: FC<LineChartLineProps> = () => null
LineChartLine.displayName = 'LineChart.Line'

export const LineChartXAxis: FC<LineChartXAxisProps> = () => null
LineChartXAxis.displayName = 'LineChart.XAxis'

export const LineChartYAxis: FC<LineChartYAxisProps> = () => null
LineChartYAxis.displayName = 'LineChart.YAxis'

export const LineChartGrid: FC = () => null
LineChartGrid.displayName = 'LineChart.Grid'
