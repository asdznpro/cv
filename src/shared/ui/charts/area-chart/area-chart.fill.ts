import type { ImagePatternObject } from 'echarts/core'
import * as echarts from 'echarts/core'

import { withAlpha } from '../lib'
import type { AreaChartFillVariant } from './area-chart.constants'

function patternFill(
	kind: 'dotted' | 'lines' | 'hatched' | 'stripe',
	color: string,
): ImagePatternObject | null {
	if (typeof document === 'undefined') return null
	const dpr = Math.max(window.devicePixelRatio || 1, 1)
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	if (!ctx) return null

	const size = (width: number, height: number) => {
		canvas.width = width * dpr
		canvas.height = height * dpr
		ctx.scale(dpr, dpr)
	}
	const pattern = (rotation = 0): ImagePatternObject => ({
		image: canvas,
		repeat: 'repeat',
		rotation,
		scaleX: 1 / dpr,
		scaleY: 1 / dpr,
	})

	if (kind === 'dotted') {
		size(6, 6)
		ctx.fillStyle = withAlpha(color, 0.7)
		ctx.beginPath()
		ctx.arc(3, 3, 0.85, 0, Math.PI * 2)
		ctx.fill()
		return pattern()
	}

	if (kind === 'lines' || kind === 'stripe') {
		size(5, 5)
		ctx.strokeStyle = withAlpha(color, 0.3)
		ctx.lineWidth = 1
		ctx.beginPath()
		ctx.moveTo(2.5, -1)
		ctx.lineTo(2.5, 6)
		ctx.stroke()
		return pattern(-Math.PI / 4)
	}

	size(20, 20)
	ctx.fillStyle = withAlpha(color, 0.06)
	ctx.fillRect(0, 0, 10, 20)
	ctx.fillStyle = withAlpha(color, 0.22)
	ctx.fillRect(10, 0, 10, 20)
	return pattern((20 * Math.PI) / 180)
}

function gradientFillTexture(
	slots: string[],
	width: number,
	height: number,
	reverse: boolean,
): HTMLCanvasElement | null {
	if (typeof document === 'undefined' || width < 1 || height < 1) return null

	const canvas = document.createElement('canvas')
	canvas.width = Math.ceil(width)
	canvas.height = Math.ceil(height)
	const ctx = canvas.getContext('2d')
	if (!ctx) return null

	const colors = ctx.createLinearGradient(0, 0, canvas.width, 0)
	slots.forEach((color, i) => {
		colors.addColorStop(i / (slots.length - 1), color)
	})
	ctx.fillStyle = colors
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	const fade = ctx.createLinearGradient(0, 0, 0, canvas.height)
	fade.addColorStop(0, `rgba(0, 0, 0, ${reverse ? 0 : 0.1})`)
	fade.addColorStop(1, `rgba(0, 0, 0, ${reverse ? 0.1 : 0})`)
	ctx.globalCompositeOperation = 'destination-in'
	ctx.fillStyle = fade
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	return canvas
}

function patternFadeTexture(
	kind: 'dotted' | 'lines' | 'hatched',
	color: string,
	width: number,
	height: number,
): HTMLCanvasElement | null {
	const patternObj = patternFill(kind, color)
	if (!patternObj || typeof document === 'undefined' || width < 1 || height < 1)
		return null
	const tile = patternObj.image
	if (!(tile instanceof HTMLCanvasElement)) return null
	const rotation = patternObj.rotation ?? 0
	const tileScale = patternObj.scaleX ?? 1

	const w = Math.ceil(width)
	const h = Math.ceil(height)
	const canvas = document.createElement('canvas')
	canvas.width = w
	canvas.height = h
	const ctx = canvas.getContext('2d')
	if (!ctx) return null

	const pat = ctx.createPattern(tile, 'repeat')
	if (!pat) return null
	if (typeof pat.setTransform === 'function') {
		const matrix = new DOMMatrix()
		matrix.rotateSelf((rotation * 180) / Math.PI)
		matrix.scaleSelf(tileScale, tileScale)
		pat.setTransform(matrix)
	}
	ctx.fillStyle = pat
	ctx.fillRect(0, 0, w, h)

	const fade = ctx.createLinearGradient(0, 0, 0, h)
	fade.addColorStop(0, 'rgba(0, 0, 0, 1)')
	fade.addColorStop(1, 'rgba(0, 0, 0, 0)')
	ctx.globalCompositeOperation = 'destination-in'
	ctx.fillStyle = fade
	ctx.fillRect(0, 0, w, h)

	return canvas
}

export function fillPaint(
	variant: AreaChartFillVariant,
	showUnselected: boolean,
	slots: string[],
	size: { width: number; height: number },
): string | echarts.graphic.LinearGradient | ImagePatternObject {
	const base = slots[0] ?? 'rgba(120, 120, 120, 1)'
	const multi = slots.length > 1

	if (variant === 'none') return 'transparent'

	if (showUnselected) {
		return patternFill('stripe', base) ?? withAlpha(base, 0.1)
	}

	switch (variant) {
		case 'gradient':
		case 'gradient-reverse': {
			const reverse = variant === 'gradient-reverse'
			if (multi) {
				const texture = gradientFillTexture(
					slots,
					size.width,
					size.height,
					reverse,
				)
				if (texture) return { image: texture, repeat: 'no-repeat' }
			}
			return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: withAlpha(base, reverse ? 0 : 0.1) },
				{ offset: 1, color: withAlpha(base, reverse ? 0.1 : 0) },
			])
		}
		case 'solid': {
			if (multi) {
				return new echarts.graphic.LinearGradient(
					0,
					0,
					1,
					0,
					slots.map((color, i) => ({
						offset: i / (slots.length - 1),
						color: withAlpha(color, 0.1),
					})),
				)
			}
			return withAlpha(base, 0.1)
		}
		case 'dotted':
		case 'lines':
		case 'hatched': {
			const texture = patternFadeTexture(variant, base, size.width, size.height)
			if (texture) return { image: texture, repeat: 'no-repeat' }
			return patternFill(variant, base) ?? withAlpha(base, 0.1)
		}
		default:
			return withAlpha(base, 0.1)
	}
}
