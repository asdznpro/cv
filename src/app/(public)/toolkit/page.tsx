import { listToolkit } from 'lib/toolkit'

import { ToolkitList } from 'widgets/toolkit'

export default async function Toolkit() {
	const items = await listToolkit()

	return (
		<>
			<span className='h-24' />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
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
