import * as echarts from 'echarts/core'

import type {
	ChartConfig,
	ChartResolvedColors,
	ChartSeriesColors,
	ChartThemeColors,
} from './types'

const FALLBACK_COLOR = 'rgba(120, 120, 120, 1)'

let normalizerCtx: CanvasRenderingContext2D | null = null

function isThemeColors(colors: ChartSeriesColors): colors is ChartThemeColors {
	return !Array.isArray(colors)
}

export function resolveSeriesColors(colors?: ChartSeriesColors): string[] {
	if (!colors) return []
	if (!isThemeColors(colors)) return colors
	return colors.dark ?? colors.light ?? []
}

export function getColorsCount(item: ChartConfig[string]): number {
	return Math.max(resolveSeriesColors(item.colors).length, 1)
}

export function distributeColors(colors: string[], maxCount: number): string[] {
	const available = colors.length
	if (available >= maxCount) return colors.slice(0, maxCount)

	const result: string[] = []
	const baseSlots = Math.floor(maxCount / available)
	const extraSlots = maxCount % available

	for (let i = 0; i < available; i++) {
		const slots = baseSlots + (i >= available - extraSlots ? 1 : 0)
		for (let j = 0; j < slots; j++) result.push(colors[i])
	}

	return result
}

export function buildChartCss(id: string, config: ChartConfig): string {
	const colorConfig = Object.entries(config).filter(([, item]) => item.colors)
	if (!colorConfig.length) return ''

	const vars = colorConfig
		.flatMap(([key, item]) => {
			const authored = resolveSeriesColors(item.colors)
			if (!authored.length) return []
			return distributeColors(authored, getColorsCount(item)).map(
				(color, index) => `--color-${key}-${index}: ${color};`,
			)
		})
		.join('\n\t')

	return `[data-chart=${id}] {\n\t${vars}\n}`
}

export function normalizeColor(value: string): string {
	const raw = value.trim()
	if (!raw || typeof document === 'undefined') return raw

	if (!normalizerCtx) {
		const canvas = document.createElement('canvas')
		canvas.width = 1
		canvas.height = 1
		normalizerCtx = canvas.getContext('2d', { willReadFrequently: true })
	}
	if (!normalizerCtx) return raw

	normalizerCtx.clearRect(0, 0, 1, 1)
	normalizerCtx.fillStyle = '#000'
	normalizerCtx.fillStyle = raw
	normalizerCtx.fillRect(0, 0, 1, 1)
	const [r, g, b, a] = normalizerCtx.getImageData(0, 0, 1, 1).data
	return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`
}

export function withAlpha(color: string, alpha: number): string {
	if (color.startsWith('#')) {
		let hex = color.slice(1)
		if (hex.length === 3) {
			hex = hex
				.split('')
				.map(char => char + char)
				.join('')
		}
		const n = Number.parseInt(hex, 16)
		return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
	}

	const match = color.match(/rgba?\(([^)]+)\)/)
	if (!match) return color
	const [r, g, b, a] = match[1].split(',').map(part => part.trim())
	const base = a === undefined ? 1 : Number.parseFloat(a) || 0
	return `rgba(${r}, ${g}, ${b}, ${(base * alpha).toFixed(3)})`
}

function readToken(computed: CSSStyleDeclaration, name: string): string {
	const raw = computed.getPropertyValue(name).trim()
	return raw ? normalizeColor(raw) : FALLBACK_COLOR
}

export function resolveColors(
	container: HTMLElement,
	config: ChartConfig,
	seriesKeys: string[],
): ChartResolvedColors {
	const computed = getComputedStyle(container)
	const series: Record<string, string[]> = {}

	for (const key of seriesKeys) {
		const count = getColorsCount(config[key] ?? {})
		const slots: string[] = []
		for (let n = 0; n < count; n++) {
			const raw = computed.getPropertyValue(`--color-${key}-${n}`).trim()
			slots.push(raw ? normalizeColor(raw) : FALLBACK_COLOR)
		}
		series[key] = slots
	}

	return {
		series,
		tokens: {
			foregroundSecondary: readToken(computed, '--foreground-secondary'),
			separator: readToken(computed, '--separator'),
			foreground: readToken(computed, '--foreground'),
			background: readToken(computed, '--background'),
			surface: readToken(computed, '--surface'),
		},
	}
}

export function seriesPaint(
	slots: string[],
): string | echarts.graphic.LinearGradient {
	if (slots.length <= 1) return slots[0] ?? FALLBACK_COLOR
	const stops = slots.map((color, i) => ({
		offset: i / (slots.length - 1),
		color,
	}))
	return new echarts.graphic.LinearGradient(0, 0, 1, 0, stops)
}

export function indicatorBackground(key: string, colorsCount: number): string {
	if (colorsCount <= 1) return `var(--color-${key}-0)`
	const stops = Array.from({ length: colorsCount }, (_, i) => {
		const offset = (i / (colorsCount - 1)) * 100
		return `var(--color-${key}-${i}) ${offset}%`
	}).join(', ')
	return `linear-gradient(to right, ${stops})`
}

export function flattenColor(color: string, base: string): string {
	const parse = (value: string) =>
		value
			.match(/rgba?\(([^)]+)\)/)?.[1]
			.split(',')
			.map(part => Number.parseFloat(part)) ?? [0, 0, 0, 1]
	const [r, g, b, a = 1] = parse(color)
	const [baseR, baseG, baseB] = parse(base)
	const mix = (channel: number, baseChannel: number) =>
		Math.round(channel * a + baseChannel * (1 - a))
	return `rgb(${mix(r, baseR)}, ${mix(g, baseG)}, ${mix(b, baseB)})`
}
