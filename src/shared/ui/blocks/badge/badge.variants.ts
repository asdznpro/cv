import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
	// base

	[
		'relative w-fit inline-flex items-center justify-center shrink-0',
		'font-sans-var font-[600] font-stretch-[0%]',
		'transition-all duration-100 ease-in',
		'select-none data-interactive:cursor-pointer focus-ring-base focus-ring-visible data-interactive:interactive-active:active:scale-98',
		'disabled:opacity-60 disabled:cursor-not-allowed',
	],

	{
		variants: {
			mode: {
				primary: '',
				soft: 'backdrop-blur-3xl',
				secondary:
					'bg-foreground-tertiary/20 data-interactive:interactive-hover:hover:bg-foreground-tertiary/40 backdrop-blur-3xl',
				outline:
					'border border-separator data-interactive:interactive-hover:hover:bg-foreground-tertiary/20',
				ghost:
					'data-interactive:interactive-hover:hover:bg-foreground-tertiary/20',
			},
			appearance: {
				accent: '',
				neutral: '',
				danger: '',
				success: '',
				info: '',
				warning: '',
			},
			size: {
				sm: 'h-5 min-h-5 min-w-5 px-1.5 [&_.in]:gap-0.5 text-2xs rounded-xs',
				md: 'h-6 min-h-6 min-w-6 px-1.5 [&_.in]:gap-0.75 text-xs rounded',
				lg: 'h-7 min-h-7 min-w-7 px-2 [&_.in]:gap-1 text-sm rounded',
			},
			radius: {
				none: 'rounded-none',
				smooth: '',
				rounded: 'rounded-full',
			},
			iconOnly: {
				true: 'px-0',
			},
		},

		compoundVariants: [
			// primary

			{
				mode: 'primary',
				appearance: 'accent',
				class:
					'text-white bg-accent data-interactive:interactive-hover:hover:bg-accent-secondary',
			},
			{
				mode: 'primary',
				appearance: 'success',
				class:
					'text-foreground-inverse bg-success data-interactive:interactive-hover:hover:bg-success-secondary',
			},
			{
				mode: 'primary',
				appearance: 'danger',
				class:
					'text-white bg-danger data-interactive:interactive-hover:hover:bg-danger-secondary',
			},
			{
				mode: 'primary',
				appearance: 'neutral',
				class:
					'text-foreground-inverse bg-foreground data-interactive:interactive-hover:hover:bg-white',
			},
			{
				mode: 'primary',
				appearance: 'info',
				class:
					'text-white bg-info data-interactive:interactive-hover:hover:bg-info-secondary',
			},
			{
				mode: 'primary',
				appearance: 'warning',
				class:
					'text-foreground-inverse bg-warning data-interactive:interactive-hover:hover:bg-warning-secondary',
			},

			// soft

			{
				mode: 'soft',
				appearance: 'accent',
				class:
					'text-accent-secondary bg-accent/20 data-interactive:interactive-hover:hover:bg-accent/40',
			},
			{
				mode: 'soft',
				appearance: 'success',
				class:
					'text-success bg-success/20 data-interactive:interactive-hover:hover:bg-success/40',
			},
			{
				mode: 'soft',
				appearance: 'danger',
				class:
					'text-danger-secondary bg-danger/20 data-interactive:interactive-hover:hover:bg-danger/40',
			},
			{
				mode: 'soft',
				appearance: 'neutral',
				class:
					'text-foreground-secondary bg-foreground-tertiary/20 data-interactive:interactive-hover:hover:bg-foreground-tertiary/40',
			},
			{
				mode: 'soft',
				appearance: 'info',
				class:
					'text-info bg-info/20 data-interactive:interactive-hover:hover:bg-info/40',
			},
			{
				mode: 'soft',
				appearance: 'warning',
				class:
					'text-warning bg-warning/20 data-interactive:interactive-hover:hover:bg-warning/40',
			},

			// secondary

			{
				mode: 'secondary',
				appearance: 'accent',
				class: 'text-accent-secondary',
			},
			{
				mode: 'secondary',
				appearance: 'success',
				class: 'text-success',
			},
			{
				mode: 'secondary',
				appearance: 'danger',
				class: 'text-danger-secondary',
			},
			{
				mode: 'secondary',
				appearance: 'neutral',
				class: 'text-foreground',
			},
			{
				mode: 'secondary',
				appearance: 'info',
				class: 'text-info',
			},
			{
				mode: 'secondary',
				appearance: 'warning',
				class: 'text-warning',
			},

			// outline

			{
				mode: 'outline',
				appearance: 'accent',
				class: 'text-accent-secondary',
			},
			{
				mode: 'outline',
				appearance: 'success',
				class: 'text-success',
			},
			{
				mode: 'outline',
				appearance: 'danger',
				class: 'text-danger-secondary',
			},
			{
				mode: 'outline',
				appearance: 'neutral',
				class: 'text-foreground',
			},
			{
				mode: 'outline',
				appearance: 'info',
				class: 'text-info',
			},
			{
				mode: 'outline',
				appearance: 'warning',
				class: 'text-warning',
			},

			// ghost

			{
				mode: 'ghost',
				appearance: 'accent',
				class: 'text-accent-secondary',
			},
			{
				mode: 'ghost',
				appearance: 'success',
				class: 'text-success',
			},
			{
				mode: 'ghost',
				appearance: 'danger',
				class: 'text-danger-secondary',
			},
			{
				mode: 'ghost',
				appearance: 'neutral',
				class: 'text-foreground-secondary',
			},
			{
				mode: 'ghost',
				appearance: 'info',
				class: 'text-info',
			},
			{
				mode: 'ghost',
				appearance: 'warning',
				class: 'text-warning',
			},
		],

		defaultVariants: {
			mode: 'primary',
			appearance: 'accent',
			size: 'lg',
			radius: 'rounded',
			iconOnly: false,
		},
	},
)
