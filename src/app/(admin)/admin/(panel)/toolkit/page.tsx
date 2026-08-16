import { listAdminToolkit } from 'lib/toolkit'

import { ToolkitManager } from 'widgets/admin'

export default async function ToolkitPage() {
	const items = await listAdminToolkit()

	return (
		<>
			<span />

			<section className="mx-auto max-w-2xl w-full flex flex-col px-app gap-12">
				<div className="flex flex-col gap-4">
					<h1 className="text-5xl text-balance font-medium font-condensed tracking-tight">
						Toolkit Manager
					</h1>

					<p className="text-foreground-secondary text-balance">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
						quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
					</p>
				</div>
			</section>

			<ToolkitManager items={items} />

			<span />
		</>
	)
}
