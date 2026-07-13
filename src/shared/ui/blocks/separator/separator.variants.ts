import { cva } from 'class-variance-authority'

export const separatorVariants = cva(
	// base

	['bg-separator'],

	{
		variants: {
			orientation: {
				horizontal: 'h-px w-full',
				vertical: 'h-full w-px',
			},
		},

		defaultVariants: {
			orientation: 'horizontal',
		},
	},
)
