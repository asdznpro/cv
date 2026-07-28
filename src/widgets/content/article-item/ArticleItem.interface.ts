import type { LinkProps } from 'next/link'

export interface ArticleItemProps extends React.AllHTMLAttributes<HTMLElement> {
	to?: LinkProps['href']
}

export interface ArticleItemInfoProps extends React.AllHTMLAttributes<HTMLElement> {
	meta?: string[]
	subtitle?: string
}
