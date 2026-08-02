import { cva, type VariantProps } from 'class-variance-authority'

export const tooltipVariants = cva(
	[
		'z-50 relative max-w-xs w-max px-3 py-2',
		'text-sm font-condensed font-semibold text-start',
		'rounded-md shadow-xl shadow-background/40',
		'pointer-events-none select-none',
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

export const tooltipArrowFill: Record<TooltipAppearance, string> = {
	neutral: 'var(--foreground)',
	accent: 'var(--accent)',
	success: 'var(--success)',
	danger: 'var(--danger)',
	warning: 'var(--warning)',
	info: 'var(--info)',
}
