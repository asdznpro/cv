import { getAdminSession } from 'lib/auth'

import { AdminShellProvider, Header, Sidebar } from 'widgets/admin'

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const user = await getAdminSession()

	return (
		<AdminShellProvider user={user}>
			<div className='w-full h-full flex flex-1'>
				<Sidebar />

				<div className='relative min-w-0 w-full flex flex-col'>
					<Header />

					<main className='overflow-x-clip w-full h-full flex flex-1 flex-col gap-12 @2xl:gap-20'>
						{children}
					</main>
				</div>
			</div>
		</AdminShellProvider>
	)
}
