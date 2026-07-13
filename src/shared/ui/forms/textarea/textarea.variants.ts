import { cva } from 'class-variance-authority'

export const textareaVariants = cva(
	// base

	[
		'relative inline-flex items-center justify-center shrink-0 overflow-hidden',
		'font-condensed font-medium',
		'transition-all duration-100 ease-in',
		'select-none focus-ring-base focus-ring-within',
		'textarea-disabled:cursor-not-allowed textarea-disabled:bg-foreground-tertiary/10',
	],

	{
		variants: {
			mode: {
				secondary:
					'bg-foreground-tertiary/20 0input-enabled:hover:bg-foreground-tertiary/30 backdrop-blur-3xl',
				outline:
					'border border-separator input-enabled:hover:border-foreground-secondary/40 input-enabled:focus-within:border-foreground-secondary/40',
			},
			status: {
				default: '',
				error: '',
				valid: '',
			},
			size: {
				md: '[&_.textarea]:max-h-[116px] [&_.textarea]:min-h-9 [&_.textarea]:px-3 [&_.textarea]:py-2 text-sm rounded-md',
				lg: '[&_.textarea]:max-h-[140px] [&_.textarea]:min-h-11 [&_.textarea]:px-4 [&_.textarea]:py-2.5 text-base rounded-md',
			},
			radius: {
				smooth: '',
				none: 'rounded-none',
			},
		},

		compoundVariants: [
			// secondary

			{
				mode: 'secondary',
				status: 'default',
				class: '',
			},
			{
				mode: 'secondary',
				status: 'valid',
				class: '',
			},
			{
				mode: 'secondary',
				status: 'error',
				class: 'border border-danger',
			},

			// outline

			{
				mode: 'outline',
				status: 'default',
				class: '',
			},
			{
				mode: 'outline',
				status: 'valid',
				class: '',
			},
			{
				mode: 'outline',
				status: 'error',
				class:
					'border border-danger input-enabled:hover:border-danger input-enabled:focus-within:border-danger',
			},
		],

		defaultVariants: {
			mode: 'secondary',
			status: 'default',
			size: 'lg',
			radius: 'smooth',
		},
	},
)
