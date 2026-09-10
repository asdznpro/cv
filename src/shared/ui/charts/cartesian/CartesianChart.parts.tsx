import type { FC } from 'react'

import type { ChartXAxisProps, ChartYAxisProps } from './cartesian.types'

export const ChartXAxis: FC<ChartXAxisProps> = () => null
ChartXAxis.displayName = 'Chart.XAxis'

export const ChartYAxis: FC<ChartYAxisProps> = () => null
ChartYAxis.displayName = 'Chart.YAxis'

export const ChartGrid: FC = () => null
ChartGrid.displayName = 'Chart.Grid'
