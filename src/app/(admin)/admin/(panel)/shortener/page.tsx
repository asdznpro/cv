import { redirect } from 'next/navigation'

import { listShortLinks } from 'lib/short-links'

import { ShortenerManager } from 'widgets/admin'

type ShortenerPageProps = {
	searchParams: Promise<{ page?: string | string[] }>
}

function parsePage(value: string | string[] | undefined) {
	const raw = Array.isArray(value) ? value[0] : value
	const page = Number(raw)
	if (!Number.isInteger(page) || page < 1) return 1
	return page
}

export default async function ShortenerPage({
	searchParams,
}: ShortenerPageProps) {
	const params = await searchParams
	const requestedPage = parsePage(params.page)
	const { links, count, page, pageSize } = await listShortLinks({
		page: requestedPage,
	})

	if (requestedPage !== page) {
		redirect(page <= 1 ? '/admin/shortener' : `/admin/shortener?page=${page}`)
	}

	return (
		<>
			<span />

			<ShortenerManager
				links={links}
				count={count}
				page={page}
				pageSize={pageSize}
			/>

			<span />
		</>
	)
}
