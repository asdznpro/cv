'use client'

import { Children, isValidElement, useRef, useState } from 'react'

import { Button } from 'ui/blocks'
import {
	Icon28CopyOutline,
	Icon28DocumentOutline,
	Icon28DoneOutline,
} from '@vkontakte/icons'

function getSlot(children: React.ReactNode, slot: 'title' | 'caption') {
	return Children.toArray(children).find(
		child =>
			isValidElement(child) &&
			(child.props as { 'data-slot'?: string })['data-slot'] === slot,
	)
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
	const bodyRef = useRef<HTMLDivElement>(null)
	const [copied, setCopied] = useState(false)

	const titleEl = getSlot(children, 'title')
	const captionEl = getSlot(children, 'caption')
	const preEl = Children.toArray(children).find(
		child => isValidElement(child) && child.type === 'pre',
	)

	const filename = isValidElement(titleEl)
		? (titleEl.props as { children: React.ReactNode }).children
		: null

	const handleCopy = async () => {
		const code = bodyRef.current?.querySelector('code')?.textContent
		if (!code) return
		await navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

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

						<Button
							type='button'
							onClick={handleCopy}
							aria-label={copied ? 'Copied' : 'Copy code'}
							size='sm'
							mode='soft'
							appearance={copied ? 'success' : 'neutral'}
							prefix={
								copied ? (
									<Icon28DoneOutline width={16} height={16} />
								) : (
									<Icon28CopyOutline width={16} height={16} />
								)
							}
							iconOnly
						/>
					</div>
				)}

				<div
					ref={bodyRef}
					className='overflow-x-auto max-h-144 p-surface text-sm leading-6'
				>
					{!hasTitle && (
						<Button
							className='absolute top-2 right-2 z-1'
							type='button'
							onClick={handleCopy}
							aria-label={copied ? 'Copied' : 'Copy code'}
							size='sm'
							mode='soft'
							appearance={copied ? 'success' : 'neutral'}
							prefix={
								copied ? (
									<Icon28DoneOutline width={16} height={16} />
								) : (
									<Icon28CopyOutline width={16} height={16} />
								)
							}
							iconOnly
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
