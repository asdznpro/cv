'use client'

import { twMerge } from 'tailwind-merge'

import { Icon28InboxOutline } from '@vkontakte/icons'

import type { EmptyStateProps } from './EmptyState.interface'

export function EmptyState(props: EmptyStateProps) {
	const { children, icon, title, summary, className, ...restProps } = props

	return (
		<div
			{...restProps}
			className={twMerge(
				'root flex flex-col items-center justify-center p-surface gap-surface',
				className,
			)}
		>
			<span className='size-12 flex items-center justify-center rounded-full bg-surface-secondary text-foreground-secondary'>
				{icon ?? <Icon28InboxOutline width={24} height={24} />}
			</span>

			<div className='max-w-sm flex flex-col gap-2 text-center text-balance'>
				<p className='text-xl font-medium font-condensed tracking-tight'>
					{title}
				</p>

				{summary && (
					<p className='text-sm text-foreground-secondary'>{summary}</p>
				)}
			</div>

			{children}
		</div>
	)
}
