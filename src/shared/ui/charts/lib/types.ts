import type { ComponentType, ReactNode } from 'react'

export type ChartThemeKey = 'light' | 'dark'

export type ChartThemeColors =
	| { light: string[]; dark?: string[] }
	| { light?: string[]; dark: string[] }

export type ChartSeriesColors = string[] | ChartThemeColors

export type ChartConfig = Record<
	string,
	{
		label?: ReactNode
		icon?: ComponentType
		colors?: ChartSeriesColors
	}
>

export type ChartResolvedTokens = {
	foregroundSecondary: string
	separator: string
	foreground: string
	background: string
	surface: string
}

export type ChartResolvedColors = {
	series: Record<string, string[]>
	tokens: ChartResolvedTokens
}
