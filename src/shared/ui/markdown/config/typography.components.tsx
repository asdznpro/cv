import type { Components } from 'react-markdown'

import { HeadingAnchor } from '../blocks'

export const typographyComponents: Pick<
	Components,
	| 'h1'
	| 'h2'
	| 'h3'
	| 'p'
	| 'strong'
	| 'ul'
	| 'li'
	| 'a'
	| 'hr'
	| 'table'
	| 'thead'
	| 'tbody'
	| 'tr'
	| 'th'
	| 'td'
> = {
	h1: ({ children, id }) => (
		<h1 id={id} className='group not-first:mt-12 mb-4 text-5xl scroll-mt-28'>
			{children}
		</h1>
	),
	h2: ({ children, id }) => (
		<h2 id={id} className='group mt-12 mb-4 text-4xl scroll-mt-28'>
			{children}
		</h2>
	),
	h3: ({ children, id }) => (
		<h3 id={id} className='group mt-12 mb-4 text-3xl scroll-mt-28'>
			{children}
		</h3>
	),

	p: ({ children }) => <p className='my-0! text-lg'>{children}</p>,
	strong: ({ children }) => (
		<strong className='font-semibold'>{children}</strong>
	),

	ul: ({ children }) => (
		<ul className='my-0! list-disc marker:text-accent pl-8 space-y-2'>
			{children}
		</ul>
	),
	li: ({ children }) => <li className='text-lg pl-1'>{children}</li>,

	a: ({ href, className, children, ...props }) => {
		const classNames = typeof className === 'string' ? className : ''
		const isHeadingAnchor =
			Boolean(href?.startsWith('#')) && classNames.includes('heading-anchor')

		if (isHeadingAnchor) {
			return (
				<HeadingAnchor href={href} className={classNames}>
					{children}
				</HeadingAnchor>
			)
		}

		return (
			<a
				{...props}
				href={href}
				target={href?.startsWith('http') ? '_blank' : undefined}
				rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
				className='underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link rounded'
			>
				{children}
			</a>
		)
	},

	hr: ({ ...props }) => (
		<hr {...props} className='mx-auto my-6! max-w-60 w-full border-separator' />
	),

	table: ({ children }) => (
		<div className='not-prose my-6! overflow-x-auto scrollbar rounded-xl border border-separator'>
			<table className='w-full min-w-160 border-collapse text-sm'>
				{children}
			</table>
		</div>
	),
	thead: ({ children }) => <thead className='bg-surface'>{children}</thead>,
	tbody: ({ children }) => <tbody>{children}</tbody>,
	tr: ({ children }) => (
		<tr className='border-b border-separator last:border-b-0'>{children}</tr>
	),
	th: ({ children }) => (
		<th className='text-foreground-secondary border-b border-r border-separator p-surface text-left align-top last:border-r-0'>
			{children}
		</th>
	),
	td: ({ children }) => (
		<td className='border-r border-separator p-surface text-left align-top text-foreground last:border-r-0'>
			{children}
		</td>
	),
}
