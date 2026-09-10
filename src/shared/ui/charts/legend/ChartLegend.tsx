'use client'

import type { CSSProperties, FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import {
	findChartPart,
	getColorsCount,
	indicatorBackground,
} from '../lib'
import type {
	ChartLegendIndicatorProps,
	ChartLegendOverlayProps,
	ChartLegendProps,
	ChartLegendSlot,
	ChartLegendVariant,
} from './ChartLegend.interface'
import {
	legendIndicatorVariants,
	legendItemVariants,
	legendOverlayVariants,
} from './legend.variants'

export const ChartLegend: FC<ChartLegendProps> = () => null
ChartLegend.displayName = 'ChartLegend'

export const DEFAULT_LEGEND_SLOT: ChartLegendSlot = {
	present: false,
	variant: 'rounded-square',
	align: 'right',
	verticalAlign: 'top',
	isClickable: false,
}

export function readLegendSlot(children: ReactNode): ChartLegendSlot {
	const props = findChartPart(children, ChartLegend)
	if (!props) return { ...DEFAULT_LEGEND_SLOT }

	return {
		present: true,
		variant: props.variant ?? 'rounded-square',
		align: props.align ?? 'right',
		verticalAlign: props.verticalAlign ?? 'top',
		isClickable: props.isClickable ?? false,
	}
}

const OUTLINE_VARIANTS: ChartLegendVariant[] = [
	'circle-outline',
	'rounded-square-outline',
]

export function legendFillStyle(
	key: string,
	colorsCount: number,
): CSSProperties {
	if (colorsCount <= 1) return { backgroundColor: `var(--color-${key}-0)` }
	return { background: indicatorBackground(key, colorsCount) }
}

export function legendOutlineStyle(
	key: string,
	colorsCount: number,
): CSSProperties {
	return {
		...legendFillStyle(key, colorsCount),
		WebkitMask:
			'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
		WebkitMaskComposite: 'xor',
		mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
		maskComposite: 'exclude',
	}
}

export function ChartLegendIndicator(props: ChartLegendIndicatorProps) {
	const { variant, dataKey, colorsCount } = props
	const isOutline = OUTLINE_VARIANTS.includes(variant)

	return (
		<div
			className={legendIndicatorVariants({ variant })}
			style={
				isOutline
					? legendOutlineStyle(dataKey, colorsCount)
					: legendFillStyle(dataKey, colorsCount)
			}
		/>
	)
}

export function ChartLegendOverlay(props: ChartLegendOverlayProps) {
	const {
		seriesKeys,
		config,
		variant,
		align,
		selectedKey,
		hoveredKey,
		isClickable,
		onToggle,
		style,
	} = props

	return (
		<div style={style} className={legendOverlayVariants({ align })}>
			{seriesKeys.map((key) => {
				const item = config[key]
				const colorsCount = item ? getColorsCount(item) : 1
				const isActive =
					(selectedKey === null || selectedKey === key) &&
					(hoveredKey === null || hoveredKey === key)
				const className = twMerge(
					legendItemVariants({
						active: isActive,
						clickable: isClickable,
					}),
				)
				const content = (
					<>
						<ChartLegendIndicator
							variant={variant}
							dataKey={key}
							colorsCount={colorsCount}
						/>
						{item?.label}
					</>
				)

				if (isClickable) {
					return (
						<button
							key={key}
							type='button'
							className={className}
							onClick={() => onToggle(key)}
						>
							{content}
						</button>
					)
				}

				return (
					<div key={key} className={className}>
						{content}
					</div>
				)
			})}
		</div>
	)
}
