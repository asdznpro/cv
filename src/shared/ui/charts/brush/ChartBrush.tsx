import type { FC, ReactNode } from 'react'

import { findChartPart } from '../lib'
import type { ChartBrushProps, ChartBrushSlot } from './ChartBrush.interface'

export const ChartBrush: FC<ChartBrushProps> = () => null
ChartBrush.displayName = 'ChartBrush'

export const DEFAULT_BRUSH_SLOT: ChartBrushSlot = {
	present: false,
}

export function readBrushSlot(children: ReactNode): ChartBrushSlot {
	const props = findChartPart(children, ChartBrush)
	if (!props) return { ...DEFAULT_BRUSH_SLOT }

	return {
		present: true,
		height: props.height,
		formatLabel: props.formatLabel,
		onChange: props.onChange,
	}
}
