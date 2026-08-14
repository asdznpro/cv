import { cva } from 'class-variance-authority'

export const counterVariants = cva(
	// base

	[
		'w-fit inline-flex items-center justify-center shrink-0 select-none rounded-full',
		'font-sans-var font-[600] font-stretch-[0%] tracking-tight',
	],

	{
		variants: {
			variant: {
				accent: 'text-white bg-accent',
				danger: 'text-white bg-danger',
				neutral: 'text-foreground-inverse bg-foreground',
				inverse: 'text-foreground bg-foreground-inverse',
			},
			size: {
				sm: 'h-4 min-h-4 min-w-4 px-1 text-xs',
				md: 'h-5 min-h-5 min-w-5 px-1 text-sm',
				lg: 'h-6 min-h-6 min-w-6 px-1.5 text-lg',
			},
		},

		compoundVariants: [],

		defaultVariants: {
			variant: 'neutral',
			size: 'sm',
		},
	},
)
