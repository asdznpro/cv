import { MarkdownAsync } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { twMerge } from 'tailwind-merge'

import { HashScroll } from './blocks'
import { markdownRehypePlugins } from './lib'
import { markdownComponents } from './markdown.components'

export async function MarkdownContent({ children }: { children: string }) {
	return (
		<div
			className={twMerge(
				'markdown prose prose-invert max-w-none flex flex-col gap-6',
				'prose-headings:font-medium prose-headings:font-condensed prose-headings:tracking-tight prose-headings:text-balance prose-headings:text-foreground',
				'prose-pre:p-0 prose-pre:bg-transparent',
			)}
		>
			<HashScroll />

			<MarkdownAsync
				remarkPlugins={[remarkGfm]}
				rehypePlugins={markdownRehypePlugins}
				components={markdownComponents}
			>
				{children}
			</MarkdownAsync>
		</div>
	)
}
