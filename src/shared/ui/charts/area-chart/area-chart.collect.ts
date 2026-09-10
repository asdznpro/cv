import type { ReactNode } from 'react'

import {
	collectCartesianSlots,
	STROKE_WIDTH,
	type CartesianSeriesBase,
	type CollectedCartesianSlots,
} from '../cartesian'
import { readDotSlot, type ChartDotVariant } from '../dots'
import { findChartParts } from '../lib'
import type { AreaChartFillVariant } from './area-chart.constants'
import type {
	AreaChartAnimationType,
	AreaChartCurveType,
	AreaChartStrokeVariant,
} from './AreaChart.interface'
import { AreaChartArea } from './AreaChart.parts'

export type CollectedAreaSeries = CartesianSeriesBase & {
	fillVariant: AreaChartFillVariant
	strokeVariant: AreaChartStrokeVariant
	curveType?: AreaChartCurveType
	animationType?: AreaChartAnimationType
	dotVariant: ChartDotVariant
	activeDotVariant: ChartDotVariant
}

export type CollectedAreaChartConfig = CollectedCartesianSlots & {
	areas: CollectedAreaSeries[]
}

export function collectAreaChartConfig(
	children: ReactNode,
): CollectedAreaChartConfig {
	const areas: CollectedAreaSeries[] = findChartParts(
		children,
		AreaChartArea,
	).map(props => {
		const { variant, activeVariant } = readDotSlot(props.children)

		return {
			dataKey: props.dataKey,
			fillVariant: props.variant ?? 'gradient',
			strokeVariant: props.strokeVariant ?? 'dashed',
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
		areas,
		...collectCartesianSlots(children),
	}
}
