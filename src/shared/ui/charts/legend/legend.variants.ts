import { cva } from 'class-variance-authority'

export const legendOverlayVariants = cva(
	'flex items-center gap-4 text-xs font-condensed tracking-tight select-none',
	{
		variants: {
			align: {
				left: 'justify-start',
				center: 'justify-center',
				right: 'justify-end',
			},
		},
		defaultVariants: {
			align: 'right',
		},
	},
)

export const legendItemVariants = cva(
	'flex items-center gap-1.5 transition-opacity duration-100 ease-in',
	{
		variants: {
			active: {
				true: '',
				false: 'opacity-30',
			},
			clickable: {
				true: 'cursor-pointer focus-ring-base focus-ring-visible rounded-xs',
				false: '',
			},
		},
		defaultVariants: {
			active: true,
			clickable: false,
		},
	},
)

export const legendIndicatorVariants = cva('shrink-0', {
	variants: {
		variant: {
			square: 'h-2 w-2',
			circle: 'h-2 w-2 rounded-full',
			'circle-outline': 'h-2.5 w-2.5 rounded-full p-[1.5px]',
			'rounded-square': 'h-2 w-2 rounded-[2px]',
			'rounded-square-outline': 'h-2.5 w-2.5 rounded-[3px] p-[1.5px]',
			'vertical-bar': 'h-3 w-1 rounded-[2px]',
			'horizontal-bar': 'h-1 w-3 rounded-[2px]',
		},
	},
	defaultVariants: {
		variant: 'rounded-square',
	},
})
