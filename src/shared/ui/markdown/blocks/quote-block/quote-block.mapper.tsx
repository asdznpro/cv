import type { Element as HastElement } from 'hast'
import type { ExtraProps } from 'react-markdown'
import type { ComponentPropsWithoutRef } from 'react'

import { QuoteBlock } from './QuoteBlock'

type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'> &
	ExtraProps & {
		node?: HastElement
	}

export function renderQuoteBlock({
	node,
	children,
	...props
}: BlockquoteProps) {
	if (!node?.properties?.dataQuoteBlock) {
		return (
			<blockquote {...props} className='border-l-2 border-accent pl-4'>
				{children}
			</blockquote>
		)
	}

	return (
		<QuoteBlock
			quote={String(node.properties.dataQuoteText ?? '')}
			attribution={String(node.properties.dataAttribution ?? '')}
			variant={node.properties.dataVariant === 'pull' ? 'pull' : 'border'}
		/>
	)
}
