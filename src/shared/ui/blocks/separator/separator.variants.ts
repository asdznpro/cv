import { cva } from 'class-variance-authority'

export const separatorVariants = cva(
	// base

	['bg-separator shrink-0'],

	{
		variants: {
			orientation: {
				horizontal: 'w-full h-px',
				vertical: 'w-px h-full',
			},
		},

		defaultVariants: {
			orientation: 'horizontal',
		},
	},
)
