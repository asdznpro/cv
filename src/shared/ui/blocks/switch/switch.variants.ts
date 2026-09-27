import { cva } from 'class-variance-authority'

export const switchVariants = cva(
	[
		'z-0 relative h-5 w-9 shrink-0 inline-flex',
		'rounded-full bg-gray-400',
		'transition-colors duration-200 ease-in',
		'select-none focus-ring-base focus-ring-within',
		'has-disabled:cursor-not-allowed has-disabled:opacity-60',
		'[&_.thumb]:translate-x-0 has-[:checked]:[&_.thumb]:translate-x-4',
		'[&_.thumb]:text-foreground-inverse',
		'[&_.icons]:-translate-x-4 has-[:checked]:[&_.icons]:translate-x-0',
		'[&_.icon-on]:hidden has-[:checked]:[&_.icon-on]:inline-flex',
	],

	{
		variants: {
			appearance: {
				accent:
					'has-[:checked]:bg-accent has-[:checked]:[&_.thumb]:text-accent',
				danger:
					'has-[:checked]:bg-danger has-[:checked]:[&_.thumb]:text-danger',
				success:
					'has-[:checked]:bg-success has-[:checked]:[&_.thumb]:text-success',
				neutral: '',
			},
		},

		defaultVariants: {
			appearance: 'accent',
		},
	},
)
