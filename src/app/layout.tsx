import type { Metadata } from 'next'
import Script from 'next/script'

import 'styles/globals.css'

import { Providers } from 'providers'

import { BootLoader, BootProvider } from 'widgets/shell'
import { Toaster } from 'ui/blocks'

export const metadata: Metadata = {
	title: {
		default:
			'Andrew S. / CV — Graphic & UI/UX Designer / Frontend Developer (React.js)',
		template: '%s — Andrew S. / CV',
	},
	description:
		'Full-cycle Designer & Developer with 7+ years in Gaming & Esports, turning product ideas from Figma concepts into scalable, production-ready features',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className='h-full antialiased'
			data-scroll-behavior='smooth'
		>
			<head>
				<meta name='apple-mobile-web-app-title' content='Andrew S. / CV' />
				<meta name='yandex-verification' content='506eca3509ce4857' />

				<meta name='msapplication-TileColor' content='#4343ef' />
				<meta name='theme-color' content='#040406' />

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

				<Script
					id='yandex-metrika'
					strategy='afterInteractive'
					dangerouslySetInnerHTML={{
						__html: `
							(function(m,e,t,r,i,k,a){
								m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
								m[i].l=1*new Date();
								for (var j=0;j<document.scripts.length;j++){
									if(document.scripts[j].src===r){return;}
								}
								k=e.createElement(t),a=e.getElementsByTagName(t)[0],
								k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
							})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

							ym(96347326,'init',{
								webvisor:true,
								clickmap:true,
								referrer:document.referrer,
								url:location.href,
								accurateTrackBounce:true,
								trackLinks:true
							});
						`,
					}}
				/>

				<noscript>
					<div>
						<img
							src='https://mc.yandex.ru/watch/96347326'
							style={{ position: 'absolute', left: '-9999px' }}
							alt=''
						/>
					</div>
				</noscript>
			</head>

			<body className='isolate relative min-h-full flex flex-col'>
				<div className='@container min-w-0 flex flex-1 flex-col items-center'>
					<Providers>
						{/* <BootProvider> */}
						{/* <BootLoader /> */}
						<Toaster />

						{children}

						{/* </BootProvider> */}
					</Providers>
				</div>
			</body>
		</html>
	)
}
