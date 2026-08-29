import type { Metadata } from 'next'

import { listToolkit } from 'lib/toolkit'

import { ToolkitList } from 'widgets/toolkit'

export const metadata: Metadata = {
	title: 'Toolkit',
	description:
		'Design, motion, frontend, backend and infra tools I use in production — from Figma and After Effects to React and Next.js.',
	alternates: {
		canonical: '/toolkit',
	},
	openGraph: {
		title: 'Toolkit',
		description:
			'Design, motion, frontend, backend and infra tools I use in production — from Figma and After Effects to React and Next.js.',
		url: '/toolkit',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Toolkit',
		description:
			'Design, motion, frontend, backend and infra tools I use in production — from Figma and After Effects to React and Next.js.',
	},
}

export default async function Toolkit() {
	const items = await listToolkit()

	return (
		<>
			<span className='h-24' />

			<section className='sr-only mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						Toolkit
					</h1>
				</div>
			</section>

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<ToolkitList items={items} />
			</section>

			<span />
		</>
	)
}
