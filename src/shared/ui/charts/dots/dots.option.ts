import type * as echarts from 'echarts/core'

import { withAlpha } from '../lib'
import type {
	ChartDotItemStyle,
	ChartDotStyle,
	ChartDotVariant,
} from './ChartDot.interface'

export const DOT_SIZES: Record<ChartDotVariant, number> = {
	none: 0,
	default: 6,
	border: 8,
	'colored-border': 6,
	ping: 8,
}

export function sampleGradient(slots: string[], t: number): string {
	if (slots.length <= 1) return slots[0] ?? 'rgba(120, 120, 120, 1)'

	const parse = (color: string) =>
		color
			.match(/rgba?\(([^)]+)\)/)?.[1]
			.split(',')
			.map(Number) ?? [120, 120, 120, 1]

	const position = t * (slots.length - 1)
	const index = Math.min(Math.floor(position), slots.length - 2)
	const fraction = position - index
	const [r1, g1, b1, a1 = 1] = parse(slots[index])
	const [r2, g2, b2, a2 = 1] = parse(slots[index + 1])
	const lerp = (from: number, to: number) => from + (to - from) * fraction

	return `rgba(${Math.round(lerp(r1, r2))}, ${Math.round(lerp(g1, g2))}, ${Math.round(lerp(b1, b2))}, ${lerp(a1, a2).toFixed(3)})`
}

export function dotItemStyle(
	variant: ChartDotVariant,
	paint: string | echarts.graphic.LinearGradient,
	background: string,
): ChartDotItemStyle {
	switch (variant) {
		case 'border':
			return { color: paint, borderColor: background, borderWidth: 2 }
		case 'colored-border':
			return { color: background, borderColor: paint, borderWidth: 1 }
		case 'ping': {
			const halo = typeof paint === 'string' ? withAlpha(paint, 0.28) : paint
			return { color: paint, borderColor: halo, borderWidth: 10 }
		}
		case 'default':
			return { color: paint, borderWidth: 0 }
		default:
			return {}
	}
}

export function dotStyle(
	variant: ChartDotVariant,
	paint: string | echarts.graphic.LinearGradient,
	background: string,
): ChartDotStyle {
	return {
		size: DOT_SIZES[variant],
		itemStyle: dotItemStyle(variant, paint, background),
	}
}
