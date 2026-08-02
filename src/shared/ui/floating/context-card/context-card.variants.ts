import { cva } from 'class-variance-authority'

export const contextCardVariants = cva([
	'z-50 relative max-w-sm w-max',
	'text-start',
	'rounded-lg shadow-xl shadow-background/40',
	'bg-background border border-separator text-foreground',
])

export const CONTEXT_CARD_ARROW_FILL = 'var(--background)'
