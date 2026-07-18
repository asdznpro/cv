'use client'

import Link from 'next/link'

import { twMerge } from 'tailwind-merge'

import type { NewsItemProps, NewsItemInfoProps } from './NewsItem.interface'

import { PreviewCard, type PreviewCardProps } from 'ui/blocks'

function NewsItemRoot({
	to,
	href,
	target,
	className,
	children,
}: NewsItemProps) {
	const classNames = twMerge(
		'relative group root flex flex-col gap-3 outline-none',
		className,
	)

	if (href) {
		return (
			<a
				href={href}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : undefined}
				className={classNames}
			>
				{children}
			</a>
		)
	}

	if (to) {
		return (
			<Link href={to} target={target} className={classNames}>
				{children}
			</Link>
		)
	}

	return <article className={classNames}>{children}</article>
}

function NewsItemPreview({
	ratio = '2:1',
	src,
	alt,
	className,
	children,
}: PreviewCardProps) {
	return (
		<PreviewCard ratio={ratio} src={src} alt={alt} className={className}>
			{children}
		</PreviewCard>
	)
}

function NewsItemInfo({ meta, title, subtitle, className }: NewsItemInfoProps) {
	return (
		<div className={twMerge('flex flex-1 flex-col gap-1', className)}>
			{meta && (
				<p className='text-xs text-foreground-secondary font-medium font-condensed uppercase'>
					{meta}
				</p>
			)}

			<h3 className='text-lg font-semibold font-condensed tracking-tight truncate transition-colors group-hover:text-accent group-focus-visible:text-accent'>
				{title}
			</h3>

			{subtitle && (
				<p className='text-xs text-foreground-secondary line-clamp-3'>
					{subtitle}
				</p>
			)}
		</div>
	)
}

export const NewsItem = Object.assign(NewsItemRoot, {
	Preview: NewsItemPreview,
	Info: NewsItemInfo,
})
