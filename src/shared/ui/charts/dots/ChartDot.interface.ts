import type * as echarts from 'echarts/core'

export type ChartDotVariant =
	| 'none'
	| 'default'
	| 'border'
	| 'colored-border'
	| 'ping'

export interface ChartDotProps {
	variant?: ChartDotVariant
}

export type ChartDotItemStyle = {
	color?: string | echarts.graphic.LinearGradient
	borderColor?: string | echarts.graphic.LinearGradient
	borderWidth?: number
	opacity?: number
}

export type ChartDotStyle = {
	size: number
	itemStyle: ChartDotItemStyle
}

export type ChartDotSlot = {
	variant: ChartDotVariant
	activeVariant: ChartDotVariant
}
