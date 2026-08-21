import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

import { elementToText } from '../lib'
import { parseSpotifyParagraph } from '../lib/parse-spotify.util'

export function rehypeSpotify() {
	return (tree: Root) => {
		visit(tree, 'element', (node: Element, index, parent) => {
			if (node.tagName !== 'p' || !parent || index == null) return

			const embed = parseSpotifyParagraph(elementToText(node))
			if (!embed) return

			parent.children.splice(index, 1, {
				type: 'element',
				tagName: 'div',
				properties: {
					dataSpotify: true,
					dataSpotifyType: embed.type,
					dataSpotifyId: embed.id,
					dataSpotifyCompact: embed.compact ? 'true' : undefined,
					dataSpotifyTheme: embed.theme,
				},
				children: [],
			})
		})
	}
}
