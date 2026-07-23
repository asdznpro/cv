import Link from 'next/link'

import { Separator } from 'ui/blocks'
import { Logo } from 'ui/brand'

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
		<div className='w-full h-full flex flex-1'>
			<aside className='sticky top-0 max-w-64 w-full max-h-screen flex flex-col border-r border-separator 0rounded-xl'>
				<div className='flex flex-col p-surface gap-surface'>
					<Link
						href='/'
						className='flex rounded-full transition-all focus-ring-base focus-ring-visible'
					>
						<Logo.Sign size={44} />
					</Link>
				</div>

				<Separator />

				<div className='scrollbar overflow-y-auto h-full flex flex-col p-surface gap-surface'>
					{NAV.map(item => (
						<Link
							key={item.href}
							href={item.href}
							className='text-lg font-condensed'
						>
							{item.label}
						</Link>
					))}
				</div>

				<Separator />

				<div className='flex flex-col p-surface gap-surface'>Action</div>
			</aside>

			<div className='w-full flex flex-col'>
				<header className='sticky top-0 z-10'>
					<div className='flex flex-col p-surface gap-surface'>Header</div>
				</header>

				<main className='overflow-x-clip w-full h-full flex flex-1 flex-col gap-12 @2xl:gap-24'>
					{children}
				</main>
			</div>
		</div>
	)
}
