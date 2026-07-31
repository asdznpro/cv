import type { Placement } from '@floating-ui/react'

import type { TooltipAlign, TooltipAppearance } from './tooltip.variants'

export default interface TooltipProps {
	children: React.ReactNode
	/** Tooltip body — short fragment / one sentence (Geist content guidance) */
	text: React.ReactNode
	/**
	 * Side of the trigger. Cross-axis alignment comes from `align`
	 * (`top` + `align="end"` → `top-end`).
	 */
	placement?: Placement
	/**
	 * Box alignment along the cross axis (Geist `boxAlign`).
	 * `start` / `end` → `*-start` / `*-end` placement.
	 */
	align?: TooltipAlign
	/**
	 * Open delay. `true` / omitted → 150ms (Geist default).
	 * `false` → immediate. number → custom ms.
	 */
	delay?: boolean | number
	/** Show caret / tip indicator */
	tip?: boolean
	appearance?: TooltipAppearance
	className?: string
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
}
