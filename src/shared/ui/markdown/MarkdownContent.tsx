import { MarkdownAsync } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { HashScroll, LightboxProvider } from './blocks'
import { markdownRehypePlugins } from './lib'
import { markdownComponents } from './markdown.components'
import { markdownRootClassName } from './markdown.styles'

export async function MarkdownContent({ children }: { children: string }) {
	return (
		<div className={markdownRootClassName}>
			<LightboxProvider>
				<HashScroll />
				<MarkdownAsync
					remarkPlugins={[remarkGfm]}
					rehypePlugins={markdownRehypePlugins}
					components={markdownComponents}
				>
					{children}
				</MarkdownAsync>
			</LightboxProvider>
		</div>
	)
}
