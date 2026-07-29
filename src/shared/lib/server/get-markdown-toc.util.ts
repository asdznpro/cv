import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger' // тот же алгоритм, что rehype-slug
import type { Heading, Root, Text, PhrasingContent } from 'mdast'

export type TocItem = {
	id: string
	depth: 2 | 3 // обычно только h2/h3, без h1 (он в шапке)
	title: string
}

function phrasingToText(nodes: PhrasingContent[]): string {
	return nodes
		.map(n => {
			if (n.type === 'text') return n.value
			if ('children' in n)
				return phrasingToText(n.children as PhrasingContent[])
			return ''
		})
		.join('')
}

export async function getMarkdownToc(markdown: string): Promise<TocItem[]> {
	const tree = remark().use(remarkGfm).parse(markdown) as Root
	const slugger = new GithubSlugger()
	const items: TocItem[] = []

	visit(tree, 'heading', (node: Heading) => {
		if (node.depth !== 2 && node.depth !== 3) return
		const title = phrasingToText(node.children).trim()
		if (!title) return
		items.push({
			id: slugger.slug(title),
			depth: node.depth as 2 | 3,
			title,
		})
	})

	return items
}
