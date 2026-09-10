import type { FC, ReactNode } from 'react'

import { findChartPart } from '../lib'
import type {
	ChartTooltipProps,
	ChartTooltipSlot,
} from './ChartTooltip.interface'

export const ChartTooltip: FC<ChartTooltipProps> = () => null
ChartTooltip.displayName = 'ChartTooltip'

export const DEFAULT_TOOLTIP_SLOT: ChartTooltipSlot = {
	present: false,
	roundness: 'lg',
	cursor: true,
	position: 'variable',
}

export function readTooltipSlot(children: ReactNode): ChartTooltipSlot {
	const props = findChartPart(children, ChartTooltip)
	if (!props) return { ...DEFAULT_TOOLTIP_SLOT }

	return {
		present: true,
		roundness: props.roundness ?? 'lg',
		cursor: props.cursor ?? true,
		position: props.position ?? 'variable',
		defaultIndex: props.defaultIndex,
	}
}
