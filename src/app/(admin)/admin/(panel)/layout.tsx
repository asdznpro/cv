import { getAdminSession } from 'lib/auth'

import {
	AdminCommandMenuHost,
	AdminShellProvider,
	Header,
	Sidebar,
} from 'widgets/admin'

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const user = await getAdminSession()

	return (
		<AdminShellProvider user={user}>
			<AdminCommandMenuHost />

			<div className='w-full h-full flex flex-1'>
				<Sidebar />

				<div className='@container relative min-w-0 w-full flex flex-col'>
					<Header />

					<main className='overflow-x-clip w-full h-full flex flex-1 flex-col gap-12 @2xl:gap-20'>
						{children}
					</main>
				</div>
			</div>
		</AdminShellProvider>
	)
}
