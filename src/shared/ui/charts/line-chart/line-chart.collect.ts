import type { ReactNode } from 'react'

import {
	collectCartesianSlots,
	STROKE_WIDTH,
	type CartesianSeriesBase,
	type CollectedCartesianSlots,
} from '../cartesian'
import { readDotSlot, type ChartDotVariant } from '../dots'
import { findChartParts } from '../lib'
import type {
	LineChartAnimationType,
	LineChartCurveType,
	LineChartStrokeVariant,
} from './LineChart.interface'
import { LineChartLine } from './LineChart.parts'

export type CollectedLineSeries = CartesianSeriesBase & {
	strokeVariant: LineChartStrokeVariant
	curveType?: LineChartCurveType
	animationType?: LineChartAnimationType
	dotVariant: ChartDotVariant
	activeDotVariant: ChartDotVariant
}

export type CollectedLineChartConfig = CollectedCartesianSlots & {
	lines: CollectedLineSeries[]
}

export function collectLineChartConfig(
	children: ReactNode,
): CollectedLineChartConfig {
	const lines: CollectedLineSeries[] = findChartParts(
		children,
		LineChartLine,
	).map(props => {
		const { variant, activeVariant } = readDotSlot(props.children)

		return {
			dataKey: props.dataKey,
			strokeVariant: props.strokeVariant ?? 'solid',
			strokeWidth: props.strokeWidth ?? STROKE_WIDTH,
			curveType: props.curveType,
			animationType: props.animationType,
			connectNulls: props.connectNulls ?? false,
			isClickable: props.isClickable ?? false,
			enableBufferLine: props.enableBufferLine ?? false,
			dotVariant: variant,
			activeDotVariant: activeVariant,
		}
	})

	return {
		lines,
		...collectCartesianSlots(children),
	}
}
