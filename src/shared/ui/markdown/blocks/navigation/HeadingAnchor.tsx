'use client'

import { twMerge } from 'tailwind-merge'
import { useClipboard } from '@siberiacancode/reactuse'
import { toast } from 'sonner'

type HeadingAnchorProps = {
	href?: string
	className?: string
	children?: React.ReactNode
}

export function HeadingAnchor({
	href,
	className,
	children,
}: HeadingAnchorProps) {
	const { copy } = useClipboard()

	if (!href?.startsWith('#')) return null

	return (
		<a
			href={href}
			aria-label='Скопировать ссылку на раздел'
			className={twMerge(
				'heading-anchor not-prose ml-2 inline-flex align-middle opacity-0 transition-opacity',
				'text-foreground-tertiary hover:text-link group-hover:opacity-100 focus-visible:opacity-100',
				className,
			)}
			onClick={async event => {
				event.preventDefault()

				const url = `${window.location.origin}${window.location.pathname}${href}`
				await copy(url)
				toast.success('Ссылка скопирована')

				document
					.getElementById(href.slice(1))
					?.scrollIntoView({ behavior: 'smooth', block: 'start' })
				history.replaceState(null, '', href)
			}}
		>
			{children}
		</a>
	)
}
