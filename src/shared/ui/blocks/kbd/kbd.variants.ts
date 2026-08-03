import { cva } from 'class-variance-authority'

export const kbdVariants = cva(
	// base

	[
		'relative w-fit inline-flex items-center justify-center shrink-0',
		'font-condensed font-semibold text-nowrap tracking-tight',
		'select-none',
	],

	{
		variants: {
			variant: {
				dark: 'text-foreground bg-foreground-inverse',
				neutral: 'text-foreground-secondary bg-foreground-tertiary/20',
			},
			size: {
				sm: 'h-5 min-h-5 min-w-5 px-1.5 text-xs',
				md: 'h-6 min-h-6 min-w-6 px-2 text-sm',
			},
			radius: {
				smooth: '',
				rounded: '',
				none: 'rounded-none',
			},
		},

		compoundVariants: [
			{ size: 'sm', radius: 'smooth', class: 'rounded-[3px]' },
			{ size: 'md', radius: 'smooth', class: 'rounded' },
		],

		defaultVariants: {
			variant: 'neutral',
			size: 'md',
			radius: 'smooth',
		},
	},
)

export function kbdGroupRadiusClass(
	size: 'sm' | 'md' | undefined,
	index: number,
	length: number,
) {
	const isSm = size === 'sm'

	if (length <= 1) return 'rounded-full'
	if (index === 0) {
		return isSm ? 'rounded-l-xl rounded-r-[3px]' : 'rounded-l-2xl rounded-r'
	}
	if (index === length - 1) {
		return isSm ? 'rounded-r-xl rounded-l-[3px]' : 'rounded-r-2xl rounded-l'
	}
	return isSm ? 'rounded-[3px]' : 'rounded'
}
