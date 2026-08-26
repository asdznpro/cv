'use client'

import { createContext, useContext } from 'react'

import { twMerge } from 'tailwind-merge'

import { Button } from '../button'

import {
	Icon28ChevronLeftOutline,
	Icon28ChevronRightOutline,
} from '@vkontakte/icons'

import type PaginationProps from './Pagination.interface'
import type {
	PaginationButtonProps,
	PaginationLabelProps,
} from './Pagination.interface'

type PaginationContextValue = {
	page: number
	pageCount: number
	from: number
	to: number
	count: number
	canPrev: boolean
	canNext: boolean
	onPageChange: (page: number) => void
}

const PaginationContext = createContext<PaginationContextValue | null>(null)

function usePagination() {
	const ctx = useContext(PaginationContext)
	if (!ctx) {
		throw new Error('Pagination.* must be used within <Pagination>')
	}
	return ctx
}

function PaginationRoot({
	page,
	pageSize,
	count,
	onPageChange,
	children,
}: PaginationProps) {
	const pageCount = Math.max(1, Math.ceil(count / pageSize) || 1)
	const safePage = Math.min(Math.max(1, page), pageCount)
	const from = count === 0 ? 0 : (safePage - 1) * pageSize + 1
	const to = Math.min(safePage * pageSize, count)

	return (
		<PaginationContext.Provider
			value={{
				page: safePage,
				pageCount,
				from,
				to,
				count,
				canPrev: safePage > 1,
				canNext: safePage < pageCount && count > 0,
				onPageChange,
			}}
		>
			{children}
		</PaginationContext.Provider>
	)
}

function Label({ className }: PaginationLabelProps) {
	const { from, to, count } = usePagination()

	return (
		<span
			className={twMerge(
				'flex-1 text-foreground-secondary text-sm truncate',
				className,
			)}
		>
			Showing {from}-{to} of {count}
		</span>
	)
}

function Prev({
	className,
	size = 'sm',
	mode = 'secondary',
	appearance = 'neutral',
}: PaginationButtonProps) {
	const { page, canPrev, onPageChange } = usePagination()

	return (
		<Button
			type='button'
			size={size}
			mode={mode}
			appearance={appearance}
			className={className}
			prefix={<Icon28ChevronLeftOutline width={16} height={16} />}
			iconOnly
			disabled={!canPrev}
			aria-label='Previous page'
			onClick={() => onPageChange(page - 1)}
		/>
	)
}

function Next({
	className,
	size = 'sm',
	mode = 'secondary',
	appearance = 'neutral',
}: PaginationButtonProps) {
	const { page, canNext, onPageChange } = usePagination()

	return (
		<Button
			type='button'
			size={size}
			mode={mode}
			appearance={appearance}
			className={className}
			prefix={<Icon28ChevronRightOutline width={16} height={16} />}
			iconOnly
			disabled={!canNext}
			aria-label='Next page'
			onClick={() => onPageChange(page + 1)}
		/>
	)
}

type PaginationComponent = typeof PaginationRoot & {
	Label: typeof Label
	Prev: typeof Prev
	Next: typeof Next
}

const Pagination = PaginationRoot as PaginationComponent
Pagination.Label = Label
Pagination.Prev = Prev
Pagination.Next = Next

Label.displayName = 'Pagination.Label'
Prev.displayName = 'Pagination.Prev'
Next.displayName = 'Pagination.Next'

export { Pagination }
