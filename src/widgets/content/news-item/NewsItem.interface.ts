import type { LinkProps } from 'next/link'

export interface NewsItemProps extends React.AllHTMLAttributes<HTMLElement> {
	to?: LinkProps['href']
}

export interface NewsItemInfoProps extends React.AllHTMLAttributes<HTMLElement> {
	meta?: string
	subtitle?: string
}
