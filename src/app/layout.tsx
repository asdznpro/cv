import type { Metadata } from 'next'

import 'styles/globals.css'

import { Header, Footer } from 'widgets'

export const metadata: Metadata = {
	title:
		'Andrew S. / CV — Graphic & UI/UX Designer / Frontend Developer (React.js)',
	description:
		'Full-cycle Designer & Developer with 7+ years in Gaming & Esports, turning product ideas from Figma concepts into scalable, production-ready features',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className='h-full antialiased scrollbar'>
			<meta name='apple-mobile-web-app-title' content='Andrew S. / CV' />

			<link
				rel='icon'
				type='image/png'
				href='/favicon/favicon-96x96.png'
				sizes='96x96'
			/>
			<link rel='icon' type='image/svg+xml' href='/favicon/favicon.svg' />
			<link rel='shortcut icon' href='/favicon/favicon.ico' />
			<link
				rel='apple-touch-icon'
				sizes='180x180'
				href='/favicon/apple-touch-icon.png'
			/>
			<link rel='manifest' href='/favicon/site.webmanifest' />

			<body className='isolate relative min-h-full flex flex-col'>
				<div className='@container min-w-0 flex flex-col flex-1 items-center'>
						<Header />

					<main className='overflow-x-clip w-full flex flex-col flex-1 gap-24'>
						{/* <ViewTransition name='main' update='page-update' default='none'> */}
						{children}
						{/* </ViewTransition> */}
					</main>

					<Footer />
				</div>
			</body>
		</html>
	)
}
