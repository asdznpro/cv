import Link from 'next/link'

const NAV = [
	{ href: '/admin', label: 'Overview' },
	{ href: '/admin/articles', label: 'Articles' },
	{ href: '/admin/experience', label: 'Experience' },
]

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='min-h-full w-full flex'>
			<aside className='w-56 shrink-0 border-r border-separator p-4 flex flex-col gap-2'>
				<Link href='/' className='text-sm text-foreground-tertiary mb-4'>
					← CV
				</Link>

				{NAV.map(item => (
					<Link
						key={item.href}
						href={item.href}
						className='text-lg font-condensed'
					>
						{item.label}
					</Link>
				))}
			</aside>

			<main className='flex-1 p-app'>{children}</main>
		</div>
	)
}
