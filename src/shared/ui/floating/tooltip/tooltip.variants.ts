import { cva, type VariantProps } from 'class-variance-authority'
import type { Placement, Side } from '@floating-ui/react'

export const tooltipVariants = cva(
	[
		'relative max-w-xs w-max px-3 py-2',
		'text-sm font-condensed font-semibold text-start',
		'rounded-md shadow-lg',
		'pointer-events-none select-none z-50',
	],
	{
		variants: {
			appearance: {
				neutral: 'bg-foreground text-foreground-inverse',
				accent: 'bg-accent text-white',
				success: 'bg-success text-foreground-inverse',
				danger: 'bg-danger text-white',
				warning: 'bg-warning text-foreground-inverse',
				info: 'bg-info text-white',
			},
		},
		defaultVariants: {
			appearance: 'neutral',
		},
	},
)

export type TooltipAppearance = NonNullable<
	VariantProps<typeof tooltipVariants>['appearance']
>

/** Cross-axis box alignment relative to the trigger (Geist `boxAlign`) */
export type TooltipAlign = 'start' | 'center' | 'end'

export const tooltipArrowFill: Record<TooltipAppearance, string> = {
	neutral: 'var(--foreground)',
	accent: 'var(--accent)',
	success: 'var(--success)',
	danger: 'var(--danger)',
	warning: 'var(--warning)',
	info: 'var(--info)',
}

/** Merge side (`top`) + align (`end`) → Floating UI placement (`top-end`) */
export function resolveTooltipPlacement(
	placement: Placement = 'top',
	align: TooltipAlign = 'center',
): Placement {
	const side = placement.split('-')[0] as Side

	if (align === 'center') return side

	return `${side}-${align}` as Placement
}
