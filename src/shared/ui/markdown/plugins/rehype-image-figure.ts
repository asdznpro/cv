import { visit } from 'unist-util-visit'
import type { Root, Element, ElementContent } from 'hast'

import { elementToText } from '../lib/hast.util'
import { parseTitle } from '../lib/parse-title.util'

function isCaptionParagraph(node?: Element): node is Element {
	if (!node || node.tagName !== 'p' || node.children.length === 0) return false

	return node.children.every(child => {
		if (child.type === 'text') return true
		if (child.type !== 'element') return false
		return ['em', 'strong', 'a', 'code', 'i'].includes(child.tagName)
	})
}

function findCaptionInParagraph(node: Element): string {
	const imgIndex = node.children.findIndex(
		child => child.type === 'element' && child.tagName === 'img',
	)
	if (imgIndex === -1) return ''

	for (const child of node.children.slice(imgIndex + 1)) {
		if (child.type === 'element' && ['em', 'i'].includes(child.tagName)) {
			return elementToText(child as Element)
		}
	}

	return ''
}

export function rehypeImageFigure() {
	return (tree: Root) => {
		visit(tree, 'element', (node: Element, index, parent) => {
			if (node.tagName !== 'p' || !parent || index == null) return

			const img = node.children.find(
				(c): c is Element => c.type === 'element' && c.tagName === 'img',
			)
			if (!img) return

			const { variant, caption } = parseTitle(
				String(img.properties?.title ?? ''),
			)

			let captionText = caption.trim()

			if (!captionText) {
				captionText = findCaptionInParagraph(node)
			}

			const next = parent.children[index + 1] as Element | undefined
			if (!captionText && isCaptionParagraph(next)) {
				captionText = elementToText(next)
				parent.children.splice(index + 1, 1)
			}

			const figureChildren: ElementContent[] = [
				{
					type: 'element',
					tagName: 'img',
					properties: {
						src: img.properties?.src,
						alt: img.properties?.alt,
					},
					children: [],
				},
			]

			if (captionText) {
				figureChildren.push({
					type: 'element',
					tagName: 'figcaption',
					properties: {},
					children: [{ type: 'text', value: captionText }],
				})
			}

			parent.children[index] = {
				type: 'element',
				tagName: 'figure',
				properties: {
					dataImageFigure: true,
					dataVariant: variant,
				},
				children: figureChildren,
			}
		})
	}
}
