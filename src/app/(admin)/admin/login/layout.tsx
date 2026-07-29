import Link from 'next/link'

import { Badge } from 'ui/blocks'
import { Logo } from 'ui/brand'

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<header className='w-full flex flex-col py-12'>
				<div className='mx-auto max-w-md w-full flex justify-center px-app'>
					<Link
						href='/'
						className='w-fit flex rounded-full transition-all focus-ring-base focus-ring-visible'
					>
						<Logo.Lockup width={164} height={44} />
					</Link>
				</div>
			</header>

			<main className='overflow-x-clip w-full h-full flex flex-1 flex-col gap-12'>
				{children}
			</main>

			<footer className='mt-auto w-full flex flex-col py-12'>
				<div className='mx-auto max-w-md w-full flex px-app text-xl text-blue-200'>
					<span className='mx-auto'>
						<Badge mode='secondary' appearance='neutral'>
							&copy; {new Date().getFullYear()}, Andrew Sukhushin / CV
						</Badge>
					</span>
				</div>
			</footer>
		</>
	)
}
