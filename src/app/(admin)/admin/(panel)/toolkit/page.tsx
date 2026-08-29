import type { Metadata } from 'next'

import { listAdminToolkit } from 'lib/toolkit'

import { ToolkitManager } from 'widgets/admin'

export const metadata: Metadata = {
	title: 'Toolkit',
	description: 'Manage your toolkit',
}

export default async function ToolkitPage() {
	const items = await listAdminToolkit()

	return (
		<>
			<span />

			<ToolkitManager items={items} />

			<span />
		</>
	)
}
