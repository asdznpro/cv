import { listShortLinks } from 'lib/short-links'
import { ShortenerManager } from 'widgets/admin'

export default async function ShortenerPage() {
	const links = await listShortLinks()

	return (
		<>
			<span />

			<ShortenerManager links={links} />

			<span />
		</>
	)
}
