import { cva } from 'class-variance-authority'

export const backdropVariants = cva('fixed inset-0 pointer-events-auto', {
	variants: {
		tone: {
			clear: 'bg-transparent',
			scrim: 'bg-background/80',
			solid: 'bg-background',
		},
	},
	defaultVariants: {
		tone: 'scrim',
	},
})
