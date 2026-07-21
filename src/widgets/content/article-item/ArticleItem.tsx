'use client'

import Link from 'next/link'

import { twMerge } from 'tailwind-merge'

import type {
	ArticleItemProps,
	ArticleItemInfoProps,
} from './ArticleItem.interface'

import { PreviewCard, type PreviewCardProps } from 'ui/blocks'

function ArticleItemRoot({
	to,
	href,
	target,
	className,
	children,
}: ArticleItemProps) {
	const classNames = twMerge(
		'relative group root flex flex-col gap-6 outline-none',
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

function ArticleItemPreview({
	ratio = '4:1',
	src,
	alt,
	className,
	children,
}: PreviewCardProps) {
	return (
		<PreviewCard
			ratio={ratio}
			src={src}
			alt={alt}
			className={className}
			sizes='(max-width: 896px) 100vw, 896px'
		>
			{children}
		</PreviewCard>
	)
}

function ArticleItemInfo({
	meta,
	title,
	subtitle,
	className,
}: ArticleItemInfoProps) {
	return (
		<div className={twMerge('flex flex-1 flex-col gap-2', className)}>
			{/* {meta && (
				<p className='text-xs text-foreground-secondary font-medium font-condensed uppercase'>
					{meta}
				</p>
			)} */}

			<h3 className='text-3xl font-semibold font-condensed tracking-tight truncate transition-colors group-hover:text-accent group-focus-visible:text-accent'>
				{title}
			</h3>

			{subtitle && (
				<p className='text-lg text-foreground-secondary line-clamp-2'>
					{subtitle}
				</p>
			)}
		</div>
	)
}

export const ArticleItem = Object.assign(ArticleItemRoot, {
	Preview: ArticleItemPreview,
	Info: ArticleItemInfo,
})
