import { cva } from 'class-variance-authority'

export const kbdVariants = cva(
	// base

	[
		'relative w-fit inline-flex items-center justify-center shrink-0',
		'text-foreground-secondary bg-foreground-tertiary/20',
		'font-condensed font-semibold text-nowrap tracking-tight',
		'select-none',
	],

	{
		variants: {
			size: {
				sm: 'h-5 min-h-5 min-w-5 px-1.5 text-xs rounded-xs',
				md: 'h-6 min-h-6 min-w-6 px-2 text-sm rounded',
			},
			radius: {
				smooth: '',
				rounded: 'rounded-full',
				none: 'rounded-none',
			},
		},

		defaultVariants: {
			size: 'md',
			radius: 'rounded',
		},
	},
)
