import { cva } from 'class-variance-authority'

export const textareaVariants = cva(
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
				md: '[&_.textarea]:max-h-[116px] [&_.textarea]:min-h-9 [&_.textarea]:px-3 [&_.textarea]:py-2 text-sm',
				lg: '[&_.textarea]:max-h-[140px] [&_.textarea]:min-h-11 [&_.textarea]:px-4 [&_.textarea]:py-2.5 text-base',
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
