import type { TooltipComponentOption } from 'echarts/components'
import { twMerge } from 'tailwind-merge'

import { escapeHtml, indicatorBackground } from '../lib'
import type {
	ChartTooltipPosition,
	ChartTooltipRoundness,
} from './ChartTooltip.interface'
import {
	tooltipBodyClass,
	tooltipDimmedClass,
	tooltipIndicatorClass,
	tooltipLabelClass,
	tooltipRowBodyClass,
	tooltipRowClass,
	tooltipSeriesLabelClass,
	tooltipSurfaceVariants,
	tooltipValueClass,
} from './tooltip.variants'

export function tooltipIndicatorHtml(key: string, colorsCount: number): string {
	return `<div class="${tooltipIndicatorClass}" style="background:${indicatorBackground(key, colorsCount)}"></div>`
}

export function tooltipRow(params: {
	indicatorHtml: string
	labelText: string
	valueText: string
	dimmed?: boolean
}): string {
	const { indicatorHtml, labelText, valueText, dimmed } = params

	return `<div class="${twMerge(tooltipRowClass, dimmed && tooltipDimmedClass)}">
	${indicatorHtml}
	<div class="${tooltipRowBodyClass}">
		<span class="${tooltipSeriesLabelClass}">${escapeHtml(labelText)}</span>
		<span class="${tooltipValueClass}">${escapeHtml(valueText)}</span>
	</div>
</div>`
}

export function tooltipShell(params: {
	label: string
	body: string
	roundness?: ChartTooltipRoundness
}): string {
	const { label, body, roundness = 'lg' } = params

	return `<div class="${tooltipSurfaceVariants({ roundness })}">
	<div class="${tooltipLabelClass}">${escapeHtml(label)}</div>
	<div class="${tooltipBodyClass}">${body}</div>
</div>`
}

export function resolveTooltipPosition(
	position: ChartTooltipPosition,
): TooltipComponentOption['position'] {
	if (position === 'variable') return undefined
	return (point, _params, _dom, _rect, size) => [
		point[0] - size.contentSize[0] / 2,
		8,
	]
}

export function tooltipBaseOption(params: {
	present: boolean
	cursor: boolean
	position: ChartTooltipPosition
	axisPointerColor: string
	strokeWidth: number
}): TooltipComponentOption {
	const { present, cursor, position, axisPointerColor, strokeWidth } = params

	return {
		show: present,
		trigger: 'axis',
		confine: true,
		displayTransition: false,
		backgroundColor: 'transparent',
		borderWidth: 0,
		padding: 0,
		extraCssText: 'box-shadow:none;',
		axisPointer: cursor
			? {
					type: 'line',
					lineStyle: {
						color: axisPointerColor,
						width: strokeWidth,
						type: [3, 3],
					},
				}
			: { type: 'none' },
		position: resolveTooltipPosition(position),
	}
}
