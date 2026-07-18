import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

import { elementToText } from '../lib/hast.util'
import {
	parseAttribution,
	stripQuotes,
	type QuoteVariant,
} from '../lib/parse-title.util'

function getLines(node: Element): string[] {
	const paragraphs = node.children.filter(
		(c): c is Element => c.type === 'element' && c.tagName === 'p',
	)

	return paragraphs
		.flatMap(p => elementToText(p).split('\n'))
		.map(line => line.trim())
		.filter(Boolean)
}

export function rehypeQuote() {
	return (tree: Root) => {
		visit(tree, 'element', (node: Element) => {
			if (node.tagName !== 'blockquote') return

			const lines = getLines(node)
			if (lines.length === 0) return

			let variant: QuoteVariant = 'border'
			const quoteParts: string[] = []
			let attribution: string | undefined

			for (const line of lines) {
				if (/^variant=(pull|border)$/.test(line)) {
					variant = line.replace('variant=', '') as QuoteVariant
					continue
				}

				const parsed = parseAttribution(line)
				if (parsed) {
					attribution = parsed
					continue
				}

				quoteParts.push(stripQuotes(line))
			}

			const quote = quoteParts.join(' ').trim()
			if (!quote) return

			node.properties = {
				...node.properties,
				dataQuoteBlock: true,
				dataVariant: variant,
				dataQuoteText: quote,
				dataAttribution: attribution,
			}

			node.children = []
		})
	}
}
