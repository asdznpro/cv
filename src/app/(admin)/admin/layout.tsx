'use client'

import { AdminShellProvider, Header, Sidebar } from 'widgets/admin'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<AdminShellProvider>
			<div className='w-full h-full flex flex-1'>
				<Sidebar />

				<div className='relative min-w-0 w-full flex flex-col'>
					<Header />

					<main className='overflow-x-clip w-full h-full flex flex-1 flex-col gap-12 @2xl:gap-24'>
						{children}
					</main>
				</div>
			</div>
		</AdminShellProvider>
	)
}
