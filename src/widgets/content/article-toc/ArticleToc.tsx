'use client'

import { useEffect, useRef, useState } from 'react'

import { twMerge } from 'tailwind-merge'

import type { ArticleTocProps } from './ArticleToc.interface'

import { Separator } from 'ui/blocks'

export function ArticleToc({ items, className }: ArticleTocProps) {
	const [activeId, setActiveId] = useState(items[0]?.id)

	const lockedRef = useRef(false)
	const pendingIdRef = useRef<string | null>(null)

	useEffect(() => {
		if (!items.length) return

		const elements = items
			.map(item => document.getElementById(item.id))
			.filter((el): el is HTMLElement => Boolean(el))

		if (!elements.length) return

		const visible = new Map<string, IntersectionObserverEntry>()

		const observer = new IntersectionObserver(
			entries => {
				if (lockedRef.current) return

				for (const entry of entries) {
					if (entry.isIntersecting) {
						visible.set(entry.target.id, entry)
					} else {
						visible.delete(entry.target.id)
					}
				}

				const next = [...visible.values()].sort(
					(a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
				)[0]

				if (next?.target.id) {
					setActiveId(next.target.id)
				}
			},
			{
				rootMargin: '-112px 0px -60% 0px',
				threshold: [0, 1],
			},
		)

		elements.forEach(el => observer.observe(el))
		return () => observer.disconnect()
	}, [items])

	const scrollTo = (id: string) => {
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		history.pushState(null, '', `#${id}`)
	}

	if (!items.length) return null

	return (
		<nav
			aria-label='Содержание статьи'
			className={twMerge('sticky top-28 w-full flex flex-col', className)}
		>
			{items.map((item, index) => {
				const active = item.id === activeId

				return (
					<a
						key={item.id}
						href={`#${item.id}`}
						aria-current={active ? 'location' : undefined}
						className='group flex gap-app outline-none'
						onClick={event => {
							event.preventDefault()
							scrollTo(item.id)
						}}
					>
						<aside className='relative z-0'>
							<span
								className={twMerge(
									'w-7 h-7 flex items-center justify-center border rounded-full text-xs font-mono transition-colors focus-ring-base focus-ring-group-visible select-none',
									active
										? 'bg-accent border-accent text-white'
										: 'bg-surface-secondary border-separator text-foreground-secondary',
								)}
							>
								{String(index + 1).padStart(2, '0')}
							</span>

							{index !== items.length - 1 && (
								<span className='absolute inset-0 -z-1 w-full h-full flex items-center justify-center'>
									<Separator orientation='vertical' />
								</span>
							)}
						</aside>

						<div className='flex-1 pb-app'>
							<span
								className={twMerge(
									'line-clamp-3 text-balance text-lg font-condensed font-medium transition-colors',
									item.depth === 3 && 'pl-1 text-base',
									active
										? 'text-foreground'
										: 'text-foreground-secondary group-hover:text-foreground group-focus-visible:text-foreground',
								)}
							>
								{item.title}
							</span>
						</div>
					</a>
				)
			})}
		</nav>
	)
}
