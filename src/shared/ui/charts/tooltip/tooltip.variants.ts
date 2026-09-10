import { cva } from 'class-variance-authority'

export const tooltipSurfaceVariants = cva(
	[
		'grid min-w-32 items-start gap-1.5 px-2.5 py-1.5',
		'border border-separator/50 bg-surface text-xs shadow-xl shadow-background/40',
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

export const tooltipIndicatorClass = 'h-2.5 w-2.5 shrink-0 rounded-[2px]'

export const tooltipRowClass = 'flex w-full flex-wrap items-center gap-2'

export const tooltipRowBodyClass =
	'flex flex-1 items-center justify-between gap-4 leading-none'

export const tooltipLabelClass =
	'font-medium font-condensed tracking-tight text-foreground'

export const tooltipSeriesLabelClass = 'text-foreground-secondary'

export const tooltipValueClass =
	'font-mono font-medium tabular-nums text-foreground'

export const tooltipBodyClass = 'grid gap-1.5'

export const tooltipDimmedClass = 'opacity-30'
