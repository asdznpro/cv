import type { Components } from 'react-markdown'

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
	h1: ({ children }) => <h2 className='mt-12 mb-4 text-5xl'>{children}</h2>,
	h2: ({ children }) => <h2 className='mt-12 mb-4 text-4xl'>{children}</h2>,
	h3: ({ children }) => <h3 className='mt-12 mb-4 text-3xl'>{children}</h3>,
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

	a: ({ href, children, ...props }) => (
		<a
			{...props}
			href={href}
			target={href?.startsWith('http') ? '_blank' : undefined}
			rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
			className='underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link rounded'
		>
			{children}
		</a>
	),

	hr: ({ ...props }) => <hr {...props} className='border-separator my-6!' />,

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
