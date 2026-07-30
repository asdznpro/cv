import { cva } from 'class-variance-authority'

export const captionVariants = cva(
	['flex gap-1.5 text-sm'],

	{
		variants: {
			status: {
				default: '',
				error: '',
			},
		},

		compoundVariants: [
			{
				status: 'default',
				class: 'text-foreground-secondary',
			},
			{
				status: 'error',
				class: 'text-danger font-medium',
			},
		],

		defaultVariants: {
			status: 'default',
		},
	},
)
