'use client'

import { Editor } from 'ui/editor'

export default function EditorPage() {
	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<Editor />
			</section>

			<span />
		</>
	)
}
