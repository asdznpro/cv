import { notFound } from 'next/navigation'

import { requireAdminSession } from 'lib/auth'
import { prefixFromAssetsPath } from 'lib/r2/keys'
import { listAssets } from 'lib/r2/list-assets'
import { AssetsManager } from 'widgets/admin'

type AssetsPageProps = {
	params: Promise<{ path?: string[] }>
}

export default async function AssetsPage({ params }: AssetsPageProps) {
	await requireAdminSession()

	const { path } = await params

	let prefix = ''
	try {
		prefix = prefixFromAssetsPath(path)
	} catch {
		notFound()
	}

	const initial = await listAssets(prefix)

	return (
		<>
			<span />

			<AssetsManager initial={initial} />

			<span />
		</>
	)
}
