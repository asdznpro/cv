import { twMerge } from 'tailwind-merge'
import type { ReactNode } from 'react'

type MasonryBlockProps = {
	columns?: 2 | 3
	children: ReactNode
}

const columnsClass = {
	2: 'columns-1 @sm:columns-2',
	3: 'columns-1 @sm:columns-2 @2xl:columns-3',
} as const

export function MasonryBlock({ columns = 2, children }: MasonryBlockProps) {
	return (
		<div
			className={twMerge(
				'not-prose my-6! gap-2',
				columnsClass[columns],
				'*:break-inside-avoid *:mt-0! *:mb-2!',
			)}
		>
			{children}
		</div>
	)
}
