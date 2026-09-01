import type { Metadata } from 'next'

import { redirect } from 'next/navigation'

import {
	listShortLinks,
	parseShortLinkOrder,
	parseShortLinkPage,
	parseShortLinkSort,
	SHORTENER_PATH,
	shortenerListHref,
} from 'lib/short-links'

import { ShortenerManager } from 'widgets/admin'

export const metadata: Metadata = {
	title: 'URL Shortener',
	description: 'Manage your URL shortener',
}

type ShortenerSearchParams = {
	page?: string | string[]
	sort?: string | string[]
	order?: string | string[]
}

type ShortenerPageProps = {
	searchParams: Promise<ShortenerSearchParams>
}

function firstParam(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value
}

function requestedHref(params: ShortenerSearchParams) {
	const search = new URLSearchParams()
	const page = firstParam(params.page)
	const sort = firstParam(params.sort)
	const order = firstParam(params.order)

	if (page) search.set('page', page)
	if (sort) search.set('sort', sort)
	if (order) search.set('order', order)

	const query = search.toString()
	return query ? `${SHORTENER_PATH}?${query}` : SHORTENER_PATH
}

export default async function ShortenerPage({
	searchParams,
}: ShortenerPageProps) {
	const params = await searchParams
	const { links, count, page, pageSize, sort, order } = await listShortLinks({
		page: parseShortLinkPage(params.page),
		sort: parseShortLinkSort(params.sort),
		order: parseShortLinkOrder(params.order),
	})

	const canonical = shortenerListHref(SHORTENER_PATH, { page, sort, order })

	if (requestedHref(params) !== canonical) {
		redirect(canonical)
	}

	return (
		<>
			<span />

			<ShortenerManager
				links={links}
				count={count}
				page={page}
				pageSize={pageSize}
				sort={sort}
				order={order}
			/>

			<span />
		</>
	)
}
