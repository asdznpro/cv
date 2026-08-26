import type { ReactNode } from 'react'

import type { ButtonProps } from '../button'

export default interface PaginationProps {
	page: number
	pageSize: number
	count: number
	onPageChange: (page: number) => void
	children: ReactNode
}

export interface PaginationLabelProps {
	className?: string
}

export type PaginationButtonProps = Pick<
	ButtonProps,
	'className' | 'size' | 'mode' | 'appearance'
>
