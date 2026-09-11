import { cva } from 'class-variance-authority'

export const tooltipSurfaceVariants = cva(
	[
		'grid min-w-32 items-start p-3 gap-3',
		'border border-separator bg-background text-xs shadow-xl shadow-background/strong',
		'font-condensed',
	],
	{
		variants: {
			roundness: {
				sm: 'rounded-sm',
				md: 'rounded-md',
				lg: 'rounded-lg',
				xl: 'rounded-xl',
			},
		},
		defaultVariants: {
			roundness: 'lg',
		},
	},
)

export const tooltipIndicatorClass = 'size-3 shrink-0 rounded'

export const tooltipRowClass = 'flex w-full flex-wrap items-center gap-2'

export const tooltipRowBodyClass =
	'flex flex-1 items-center justify-between gap-4 leading-none'

export const tooltipLabelClass =
	'font-medium font-condensed tracking-tight text-foreground'

export const tooltipSeriesLabelClass = 'text-foreground-secondary'

export const tooltipValueClass =
	'font-mono font-medium tabular-nums text-foreground'

export const tooltipBodyClass = 'grid gap-2'

export const tooltipDimmedClass = 'opacity-30'
