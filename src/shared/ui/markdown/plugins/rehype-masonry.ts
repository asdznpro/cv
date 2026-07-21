import { visit } from 'unist-util-visit'
import type { Root, Element, ElementContent } from 'hast'

import { elementToText } from '../lib'

const MARKER = /^masonry(?:\s+columns=([23]))?$/i

export function rehypeMasonry() {
	return (tree: Root) => {
		visit(tree, 'element', (node: Element, index, parent) => {
			if (node.tagName !== 'p' || !parent || index == null) return

			const match = elementToText(node).match(MARKER)
			if (!match) return

			const columns = Number(match[1] ?? 2) === 3 ? 3 : 2
			const items: Element[] = []
			let cursor = index + 1

			function isWhitespace(node: ElementContent): boolean {
				return node.type === 'text' && !String(node.value).trim()
			}

			function isMasonryItem(node: ElementContent): node is Element {
				if (node.type !== 'element') return false
				if (node.tagName === 'figure') return true
				return (
					node.tagName === 'p' &&
					node.children.some(c => c.type === 'element' && c.tagName === 'img')
				)
			}

			while (cursor < parent.children.length) {
				const next = parent.children[cursor]
				if (isWhitespace(next as ElementContent)) {
					cursor += 1
					continue
				}
				if (!isMasonryItem(next as ElementContent)) break
				items.push(next as Element)
				cursor += 1
			}

			for (const item of items) {
				item.properties = {
					...item.properties,
					dataMasonryItem: true,
				}
			}

			if (items.length === 0) return

			parent.children.splice(index, cursor - index, {
				type: 'element',
				tagName: 'div',
				properties: { dataMasonry: true, dataColumns: columns },
				children: items,
			})
		})
	}
}
