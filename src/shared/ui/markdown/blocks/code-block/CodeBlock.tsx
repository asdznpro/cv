'use client'

import { Children, isValidElement, useRef } from 'react'

import { CopyButton } from 'ui/blocks'
import { Icon28DocumentOutline } from '@vkontakte/icons'

function getSlot(children: React.ReactNode, slot: 'title' | 'caption') {
	return Children.toArray(children).find(
		child =>
			isValidElement(child) &&
			(child.props as { 'data-slot'?: string })['data-slot'] === slot,
	)
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
	const bodyRef = useRef<HTMLDivElement>(null)

	const titleEl = getSlot(children, 'title')
	const captionEl = getSlot(children, 'caption')
	const preEl = Children.toArray(children).find(
		child => isValidElement(child) && child.type === 'pre',
	)

	const filename = isValidElement(titleEl)
		? (titleEl.props as { children: React.ReactNode }).children
		: null

	const codeValue = () =>
		bodyRef.current?.querySelector('code')?.textContent ?? ''

	const hasTitle = Boolean(filename)

	return (
		<div className='flex flex-col gap-4'>
			<div className='relative bg-background rounded-surface border border-separator overflow-hidden'>
				{hasTitle && (
					<div className='h-12 flex items-center justify-between gap-3 border-b border-separator bg-surface px-surface'>
						<span className='flex min-w-0 items-center gap-2 text-foreground-secondary'>
							<Icon28DocumentOutline
								width={20}
								height={20}
								className='shrink-0'
							/>

							<span className='text-sm truncate'>{filename}</span>
						</span>

						<CopyButton value={codeValue} aria-label='Copy code' size='sm' />
					</div>
				)}

				<div
					ref={bodyRef}
					className='overflow-x-auto max-h-144 p-surface text-sm leading-6'
				>
					{!hasTitle && (
						<CopyButton
							className='absolute top-2 right-2 z-1'
							value={codeValue}
							aria-label='Copy code'
							size='sm'
						/>
					)}

					{preEl}
				</div>
			</div>

			{captionEl && (
				<p className='text-center text-sm text-foreground-secondary'>
					{isValidElement(captionEl)
						? (captionEl.props as { children: React.ReactNode }).children
						: null}
				</p>
			)}
		</div>
	)
}
