import { cva } from 'class-variance-authority'

export const checkboxVariants = cva(
	[
		'z-0 relative size-5 shrink-0 inline-flex items-center justify-center p-0.25',
		'rounded',
		'transition-colors duration-100 ease-in',
		'select-none focus-ring-base focus-ring-within',
		'has-disabled:cursor-not-allowed has-disabled:opacity-60',
	],

	{
		variants: {
			state: {
				off: 'bg-foreground-tertiary/40 text-transparent',
				on: 'bg-accent text-white',
				mixed: 'bg-accent text-white',
			},
		},

		defaultVariants: {
			state: 'off',
		},
	},
)
