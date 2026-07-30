import { cva } from 'class-variance-authority'

export const inputVariants = cva(
	[
		'z-0 relative group inline-flex items-center justify-center shrink-0',
		'font-condensed font-medium',
		'select-none',
		'input-disabled:cursor-not-allowed',
	],

	{
		variants: {
			mode: {
				secondary: '',
				outline: '',
			},
			status: {
				default: '',
				error: '',
			},
			size: {
				md: 'h-9 min-h-9 min-w-9 px-1.5 [&_.in]:gap-1 text-sm',
				lg: 'h-11 min-h-11 min-w-11 px-2 [&_.in]:gap-1.5 text-base',
			},
			radius: {
				smooth: '',
				rounded: '',
				none: '',
			},
		},

		defaultVariants: {
			mode: 'secondary',
			status: 'default',
			size: 'lg',
			radius: 'smooth',
		},
	},
)
