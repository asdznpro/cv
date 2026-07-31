import type { Placement, Side } from '@floating-ui/react'

export type FloatingAlign = 'start' | 'center' | 'end'

/** Merge side (`top`) + align (`end`) → Floating UI placement (`top-end`) */
export function resolveFloatingPlacement(
	placement: Placement = 'top',
	align: FloatingAlign = 'center',
): Placement {
	const side = placement.split('-')[0] as Side

	if (align === 'center') return side

	return `${side}-${align}` as Placement
}
