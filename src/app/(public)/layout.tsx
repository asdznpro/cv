import { ViewTransition } from 'react'

import { Header, Footer } from 'widgets'

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />

			<main className='overflow-x-clip w-full h-full flex flex-1 flex-col gap-12 @2xl:gap-24'>
				{/* <ViewTransition name='main' update='page-update' default='none'> */}
				{children}
				{/* </ViewTransition> */}
			</main>

			<Footer />
		</>
	)
}
