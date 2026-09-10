import { ViewTransition } from 'react'

import { BootLoader, BootProvider, Header, Footer } from 'widgets/shell'

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<BootProvider>
				<BootLoader />

				<Header />

				<main className='overflow-x-clip w-full h-full flex flex-1 flex-col gap-12 @2xl:gap-24'>
					{/* <ViewTransition name='main' update='page-update' default='none'> */}
					{children}
					{/* </ViewTransition> */}
				</main>

				<Footer />
			</BootProvider>
		</>
	)
}
