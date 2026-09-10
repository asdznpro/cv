import type { ChartResolvedTokens } from '../lib/types'

export interface ChartBrushRange {
	startIndex: number
	endIndex: number
}

export interface ChartBrushProps {
	height?: number
	formatLabel?: (value: string, index: number) => string
	onChange?: (range: ChartBrushRange) => void
}

export interface ChartBrushSlot {
	present: boolean
	height?: number
	formatLabel?: (value: string, index: number) => string
	onChange?: (range: ChartBrushRange) => void
}

export type ChartBrushZoomRange = { start: number; end: number }
export type ChartBrushGeometry = { bottom: number; height: number }

export type ChartBrushHover = { left: boolean; right: boolean }

export type ChartBrushOverlayParams = {
	range: ChartBrushZoomRange
	geom: ChartBrushGeometry
	size: { width: number; height: number }
	tokens: ChartResolvedTokens
	labels: { start: string; end: string } | null
	showLabels: boolean
	hover: ChartBrushHover
}

export const DEFAULT_BRUSH_HEIGHT = 56
export const BRUSH_BORDER_OPACITY = 1
export const BRUSH_TRACK_RADIUS = 6
