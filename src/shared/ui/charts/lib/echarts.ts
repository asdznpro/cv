import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import * as echarts from 'echarts/core'

export const ECHARTS_RENDERERS = {
	canvas: 'canvas',
	svg: 'svg',
} as const

export type EChartsRenderer =
	(typeof ECHARTS_RENDERERS)[keyof typeof ECHARTS_RENDERERS]

export const DEFAULT_ECHARTS_RENDERER = ECHARTS_RENDERERS.canvas

echarts.use([CanvasRenderer, SVGRenderer])
