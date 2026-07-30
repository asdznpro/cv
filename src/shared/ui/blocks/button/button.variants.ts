import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
	// base

	[
		'relative w-fit inline-flex items-center justify-center shrink-0',
		'font-sans-var font-[650] font-stretch-[0%]',
		'transition-all duration-100 ease-in',
		'select-none cursor-pointer focus-ring-base focus-ring-visible interactive-active:active:scale-98',
		'disabled:opacity-60 disabled:cursor-not-allowed',
	],

	{
		variants: {
			mode: {
				primary: '',
				soft: 'backdrop-blur-3xl',
				secondary:
					'bg-foreground-tertiary/20 interactive-hover:hover:bg-foreground-tertiary/40 backdrop-blur-3xl',
				outline:
					'border border-separator interactive-hover:hover:bg-foreground-tertiary/20',
				ghost: 'interactive-hover:hover:bg-foreground-tertiary/20',
			},
			appearance: {
				accent: '',
				neutral: '',
				danger: '',
				success: '',
			},
			size: {
				sm: 'h-7 min-h-7 min-w-7 px-1 [&_.in]:gap-1 text-sm rounded-sm [--ring-radius:var(--radius-sm)]',
				md: 'h-9 min-h-9 min-w-9 px-1.5 [&_.in]:gap-1 text-sm rounded-md [--ring-radius:var(--radius-md)]',
				lg: 'h-11 min-h-11 min-w-11 px-2 [&_.in]:gap-2 text-base rounded-md [--ring-radius:var(--radius-md)]',
			},
			align: {
				center: 'w-fit [&_.in]:flex [&_.in]:justify-center',
				spread: [
					'w-full',
					'[&_.in]:grid [&_.in]:w-full [&_.in]:items-center',
					'[&_.in]:grid-cols-[auto_1fr_auto_1fr_auto]',
					'[&_.in:not(:has(.spacing))]:grid-cols-[1fr_auto_1fr]',
					'[&_.prefix]:justify-self-start',
					'[&_.content]:justify-self-center [&_.content]:min-w-0',
					'[&_.suffix]:justify-self-end',
				],
				between: [
					'w-full',
					'[&_.in]:flex [&_.in]:w-full [&_.in]:justify-start',
					'[&_.suffix]:ml-auto',
				],
			},
			radius: {
				none: 'rounded-none [--ring-radius:var(--radius-none)]',
				smooth: '',
				rounded: 'rounded-full [--ring-radius:1000px]',
			},
		},

		compoundVariants: [
			// primary

			{
				mode: 'primary',
				appearance: 'accent',
				class:
					'text-white bg-accent interactive-hover:hover:bg-accent-secondary 0hover-accent-ring',
			},
			{
				mode: 'primary',
				appearance: 'success',
				class:
					'text-foreground-inverse bg-success interactive-hover:hover:bg-success-secondary',
			},
			{
				mode: 'primary',
				appearance: 'danger',
				class:
					'text-white bg-danger interactive-hover:hover:bg-danger-secondary',
			},
			{
				mode: 'primary',
				appearance: 'neutral',
				class:
					'text-foreground-inverse bg-foreground interactive-hover:hover:bg-white',
			},

			// soft

			{
				mode: 'soft',
				appearance: 'accent',
				class:
					'text-accent-secondary bg-accent/20 interactive-hover:hover:bg-accent/40',
			},
			{
				mode: 'soft',
				appearance: 'success',
				class:
					'text-success bg-success/20 interactive-hover:hover:bg-success/40',
			},
			{
				mode: 'soft',
				appearance: 'danger',
				class:
					'text-danger-secondary bg-danger/20 interactive-hover:hover:bg-danger/40',
			},
			{
				mode: 'soft',
				appearance: 'neutral',
				class:
					'text-foreground-secondary bg-foreground-tertiary/20 interactive-hover:hover:bg-foreground-tertiary/40',
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
		],

		defaultVariants: {
			mode: 'primary',
			appearance: 'accent',
			size: 'md',
			align: 'center',
			radius: 'smooth',
		},
	},
)
