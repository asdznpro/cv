import { cva } from 'class-variance-authority'

export const autocompleteVariants = cva(
	[
		'z-0 relative group inline-flex items-center justify-center shrink-0',
		'font-condensed font-medium',
		'select-none',
		'textarea-disabled:cursor-not-allowed',
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
				md: '[&_.autocomplete]:max-h-[116px] [&_.autocomplete]:min-h-9 [&_.autocomplete]:px-3 [&_.autocomplete]:py-2 text-sm',
				lg: '[&_.autocomplete]:max-h-[140px] [&_.autocomplete]:min-h-11 [&_.autocomplete]:px-4 [&_.autocomplete]:py-2.5 text-base',
			},
			radius: {
				smooth: '',
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
