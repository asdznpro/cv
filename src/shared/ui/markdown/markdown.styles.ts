import { twMerge } from 'tailwind-merge'

export const markdownRootClassName = twMerge(
	'markdown prose prose-invert max-w-none flex flex-col gap-6',
	'prose-headings:font-medium prose-headings:font-condensed prose-headings:tracking-tight prose-headings:text-balance prose-headings:text-foreground',
	'prose-pre:p-0 prose-pre:bg-transparent',
)
