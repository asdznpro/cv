import { cva } from 'class-variance-authority'

export const inputVariants = cva(
	// base

	[
		'relative inline-flex items-center justify-center shrink-0',
		'font-condensed font-medium',
		'transition-all duration-100 ease-in',
		'select-none focus-ring-base focus-ring-within',
		'input-disabled:cursor-not-allowed input-disabled:bg-foreground-tertiary/10',
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
				md: 'h-9 min-h-9 min-w-9 px-1.5 [&_.in]:gap-1 text-sm rounded-md',
				lg: 'h-11 min-h-11 min-w-11 px-2 [&_.in]:gap-1.5 text-base rounded-md',
			},
			radius: {
				smooth: '',
				rounded: 'rounded-full',
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
