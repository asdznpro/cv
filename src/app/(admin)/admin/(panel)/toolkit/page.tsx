import { listAdminToolkit } from 'lib/toolkit'

import { ToolkitManager } from 'widgets/admin'

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
