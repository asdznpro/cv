import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
	title: 'Andrew S. / CV',
	description:
		'Full-cycle Designer & Developer with 7+ years in Gaming & Esports, turning product ideas from Figma concepts into scalable, production-ready features',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className='h-full antialiased'>
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

			<body className='min-h-full flex flex-col'>{children}</body>
		</html>
	)
}
