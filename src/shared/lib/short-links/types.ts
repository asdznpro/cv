export const SHORT_LINK_HOST = 'go.asdzn.pro'
export const SHORTENER_PATH = '/admin/shortener'
export const SHORT_LINKS_PAGE_SIZE = 10

export const SHORT_LINK_SORT_FIELDS = [
	'title',
	'date',
	'views',
	'views_24h',
	'visitors',
	'visitors_24h',
] as const

export type ShortLinkSortField = (typeof SHORT_LINK_SORT_FIELDS)[number]
export type ShortLinkSortOrder = 'asc' | 'desc'

export const DEFAULT_SHORT_LINK_SORT: ShortLinkSortField = 'views_24h'
export const DEFAULT_SHORT_LINK_ORDER: ShortLinkSortOrder = 'desc'

export type ShortLink = {
	id: string
	slug: string
	target_url: string
	title: string | null
	clicks: number
	unique_visitors: number
	/** Rolling last 24 hours (from short_link_events). */
	clicks_24h: number
	uniques_24h: number
	created_at: string
	updated_at: string
}

export type ShortLinkClick = {
	id: string
	created_at: string
}

export type ShortLinkVisit = {
	id: string
	hits: number
	first_seen_at: string
	last_seen_at: string
	country: string | null
	city: string | null
	as_org: string | null
	browser: string | null
	os: string | null
	device: string | null
	referer: string | null
	clicks: ShortLinkClick[]
}

export type ShortLinkListResult = {
	links: ShortLink[]
	count: number
	page: number
	pageSize: number
	sort: ShortLinkSortField
	order: ShortLinkSortOrder
}

export type ShortenerListQuery = {
	page?: number
	sort?: ShortLinkSortField
	order?: ShortLinkSortOrder
}

function firstSearchParam(value: string | string[] | null | undefined) {
	if (Array.isArray(value)) return value[0]
	return value ?? undefined
}

export function parseShortLinkPage(
	value: string | string[] | number | null | undefined,
) {
	if (typeof value === 'number') {
		if (!Number.isInteger(value) || value < 1) return 1
		return value
	}

	const page = Number(firstSearchParam(value))
	if (!Number.isInteger(page) || page < 1) return 1
	return page
}

export function parseShortLinkSort(
	value: string | string[] | null | undefined,
): ShortLinkSortField {
	const raw = firstSearchParam(value)
	return SHORT_LINK_SORT_FIELDS.includes(raw as ShortLinkSortField)
		? (raw as ShortLinkSortField)
		: DEFAULT_SHORT_LINK_SORT
}

export function parseShortLinkOrder(
	value: string | string[] | null | undefined,
): ShortLinkSortOrder {
	return firstSearchParam(value) === 'asc' ? 'asc' : DEFAULT_SHORT_LINK_ORDER
}

export function shortenerListHref(
	pathname = SHORTENER_PATH,
	query: ShortenerListQuery = {},
) {
	const page = query.page ?? 1
	const sort = query.sort ?? DEFAULT_SHORT_LINK_SORT
	const order = query.order ?? DEFAULT_SHORT_LINK_ORDER
	const params = new URLSearchParams()

	if (page > 1) params.set('page', String(page))
	if (sort !== DEFAULT_SHORT_LINK_SORT) params.set('sort', sort)
	if (order !== DEFAULT_SHORT_LINK_ORDER) params.set('order', order)

	const search = params.toString()
	return search ? `${pathname}?${search}` : pathname
}

export type ShortLinkInput = {
	slug?: string | null
	target_url: string
	title?: string | null
}

export function shortLinkHref(slug: string) {
	return `https://${SHORT_LINK_HOST}/${slug}`
}

export function stripUrlProtocol(url: string) {
	return url.replace(/^https?:\/\//i, '')
}

export function generateShortSlug(length = 7) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
	const bytes = crypto.getRandomValues(new Uint8Array(length))
	return Array.from(bytes, b => alphabet[b % alphabet.length]).join('')
}

export function normalizeShortLinkInput(input: ShortLinkInput): ShortLinkInput {
	const target_url = input.target_url.trim()
	const title = input.title?.trim() || null
	const slugRaw = input.slug?.trim().toLowerCase() || ''
	const slug = slugRaw || null

	return { slug, target_url, title }
}

export function validateShortLinkInput(input: ShortLinkInput) {
	const data = normalizeShortLinkInput(input)
	const errors: Partial<Record<'slug' | 'target_url' | 'title', string>> = {}

	if (!data.target_url) {
		errors.target_url = 'Укажите URL'
	} else {
		try {
			const url = new URL(data.target_url)
			if (url.protocol !== 'http:' && url.protocol !== 'https:') {
				errors.target_url = 'Только http(s) URL'
			}
		} catch {
			errors.target_url = 'Некорректный URL'
		}
	}

	if (data.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
		errors.slug = 'Только a-z, 0-9 и дефисы'
	}

	return { data, errors, ok: Object.keys(errors).length === 0 }
}
