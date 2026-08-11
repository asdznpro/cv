'use client'

import { MarkdownHooks } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { LightboxProvider } from './blocks'
import { markdownRehypePlugins } from './lib'
import { markdownComponents } from './markdown.components'
import { markdownRootClassName } from './markdown.styles'

const remarkPlugins = [remarkGfm]

export function MarkdownPreview({ children }: { children: string }) {
	if (!children.trim()) {
		return (
			<p className="text-foreground-secondary text-sm">
				Nothing to preview yet.
			</p>
		)
	}

	return (
		<div className={markdownRootClassName}>
			<LightboxProvider>
				<MarkdownHooks
					remarkPlugins={remarkPlugins}
					rehypePlugins={markdownRehypePlugins}
					components={markdownComponents}
					fallback={
						<p className="text-foreground-secondary text-sm">Rendering…</p>
					}
				>
					{children}
				</MarkdownHooks>
			</LightboxProvider>
		</div>
	)
}
