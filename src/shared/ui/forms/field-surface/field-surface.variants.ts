import { cva } from 'class-variance-authority'

export const fieldSurfaceVariants = cva(
	[
		'field-surface absolute inset-0 -z-10 pointer-events-none',
		'transition-all duration-100 ease-in',
		'outline-2 outline-offset-2 outline-foreground-secondary/0',
		'group-focus-within:outline-foreground-secondary/40',
	],

	{
		variants: {
			mode: {
				secondary: 'bg-foreground-tertiary/20 backdrop-blur-3xl',
				outline: 'bg-background border border-separator',
			},
			status: {
				default: '',
				error: '',
			},
			radius: {
				smooth: 'rounded-md',
				rounded: 'rounded-full',
				none: 'rounded-none',
			},
			disabled: {
				true: '',
				false: '',
			},
		},

		compoundVariants: [
			// default

			{
				mode: 'outline',
				status: 'default',
				disabled: false,
				class: [
					'group-hover:border-foreground-secondary/40',
					'group-focus-within:border-foreground-secondary/40',
				],
			},
			{
				mode: 'outline',
				status: 'error',
				disabled: false,
				class: [
					'group-hover:border-danger',
					'group-focus-within:border-danger',
				],
			},

			// error

			{
				mode: 'secondary',
				status: 'error',
				class: 'border-2 border-danger',
			},
			{
				mode: 'outline',
				status: 'error',
				class: 'border-2 border-danger',
			},

			// disabled

			{
				mode: 'secondary',
				disabled: true,
				class: 'bg-foreground-tertiary/10',
			},

			{
				mode: 'outline',
				disabled: true,
				class: 'bg-surface-secondary',
			},
		],

		defaultVariants: {
			mode: 'secondary',
			status: 'default',
			radius: 'smooth',
			disabled: false,
		},
	},
)
