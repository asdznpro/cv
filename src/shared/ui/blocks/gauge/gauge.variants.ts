import { cva } from 'class-variance-authority'

export const gaugeVariants = cva(
	'relative inline-flex shrink-0 items-center justify-center',
	{
		variants: {
			size: {
				tiny: 'size-4',
				sm: 'size-6',
				md: 'size-8',
				lg: 'size-10',
				xl: 'size-40',
			},
			appearance: {
				accent: '[&_[data-gauge-path]]:stroke-accent',
				highlight: '[&_[data-gauge-path]]:stroke-highlight',
				neutral: '[&_[data-gauge-path]]:stroke-foreground-secondary',
				success: '[&_[data-gauge-path]]:stroke-success',
				danger: '[&_[data-gauge-path]]:stroke-danger',
				info: '[&_[data-gauge-path]]:stroke-info',
				warning: '[&_[data-gauge-path]]:stroke-warning',
			},
		},
		defaultVariants: {
			size: 'md',
			appearance: 'accent',
		},
	},
)

export const gaugeTrailVariants = cva('fill-none stroke-separator', {
	variants: {
		size: {
			tiny: 'stroke-1',
			sm: 'stroke-[1.5]',
			md: 'stroke-2',
			lg: 'stroke-2',
			xl: 'stroke-4',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

export const gaugePathVariants = cva(
	'fill-none transition-[stroke-dashoffset] duration-500 ease-out',
	{
		variants: {
			size: {
				tiny: 'stroke-1',
				sm: 'stroke-[1.5]',
				md: 'stroke-2',
				lg: 'stroke-2',
				xl: 'stroke-4',
			},
			indeterminate: {
				true: 'animate-spin origin-center [animation-duration:1s]',
				false: '',
			},
		},
		defaultVariants: {
			size: 'md',
			indeterminate: false,
		},
	},
)

export const gaugeValueVariants = cva(
	'pointer-events-none absolute inset-0 flex items-center justify-center font-condensed font-medium tracking-tight tabular-nums',
	{
		variants: {
			size: {
				tiny: 'text-[8px]',
				sm: 'text-2xs',
				md: 'text-xs',
				lg: 'text-sm',
				xl: 'text-2xl',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
)
