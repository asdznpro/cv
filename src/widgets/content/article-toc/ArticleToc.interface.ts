export type ArticleTocItem = {
	id: string
	depth: 2 | 3
	title: string
}

export interface ArticleTocProps {
	items: ArticleTocItem[]
	className?: string
}
