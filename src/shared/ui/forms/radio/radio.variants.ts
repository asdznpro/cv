import { cva } from 'class-variance-authority'

export const radioVariants = cva([
	'z-0 relative size-5 shrink-0 inline-flex items-center justify-center',
	'rounded-full bg-foreground-tertiary/40',
	'transition-colors duration-100 ease-in',
	'select-none focus-ring-base focus-ring-within',
	'has-disabled:cursor-not-allowed has-disabled:opacity-60',
	'has-[:checked]:bg-accent',
	'[&>span]:opacity-0 has-[:checked]:[&>span]:opacity-100',
])
