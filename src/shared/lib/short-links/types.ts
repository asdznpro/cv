export const SHORT_LINK_HOST = 'go.asdzn.pro'

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
	return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
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
