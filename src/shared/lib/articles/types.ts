import { slugify } from 'transliteration'

export const ARTICLE_STATUSES = ['draft', 'published', 'archived'] as const
export const ARTICLE_TYPES = ['article', 'link'] as const
export const ARTICLE_CATEGORIES = ['experience', 'other'] as const
export const ARTICLE_TAGS = [
	'esports',
	'experience',
	'graphic',
	'smm',
	'frontend',
	'about',
] as const
export const ARTICLE_RELATED_MODES = ['auto', 'manual'] as const

export type ArticleStatus = (typeof ARTICLE_STATUSES)[number]
export type ArticleType = (typeof ARTICLE_TYPES)[number]
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]
export type ArticleTag = (typeof ARTICLE_TAGS)[number]
export type ArticleRelatedMode = (typeof ARTICLE_RELATED_MODES)[number]

export type ArticleCompany = {
	id: string
	name: string
	slug: string
	logo: string
	url: string | null
}

export type Article = {
	id: string
	title: string
	description: string
	content: string
	cover_url: string | null
	company_id: string | null
	company: ArticleCompany | null
	type: ArticleType
	status: ArticleStatus
	slug: string | null
	external_url: string | null
	category: ArticleCategory
	tags: ArticleTag[]
	related_mode: ArticleRelatedMode
	related_article_ids: string[]
	views: number
	unique_visitors: number
	/** Rolling last 24 hours (from article_view_events). */
	views_24h: number
	uniques_24h: number
	priority: number
	created_at: string
	updated_at: string
}

export type ArticleInput = {
	title: string
	description?: string
	content?: string
	cover_url?: string | null
	company_id?: string | null
	type: ArticleType
	status?: ArticleStatus
	slug?: string | null
	external_url?: string | null
	category?: ArticleCategory
	tags?: ArticleTag[]
	related_mode?: ArticleRelatedMode
	related_article_ids?: string[]
	priority?: number
}

export type ArticleListFilter = {
	status?: ArticleStatus | 'all'
}

function isArticleType(value: string): value is ArticleType {
	return (ARTICLE_TYPES as readonly string[]).includes(value)
}

function isArticleStatus(value: string): value is ArticleStatus {
	return (ARTICLE_STATUSES as readonly string[]).includes(value)
}

function isArticleCategory(value: string): value is ArticleCategory {
	return (ARTICLE_CATEGORIES as readonly string[]).includes(value)
}

function isArticleTag(value: string): value is ArticleTag {
	return (ARTICLE_TAGS as readonly string[]).includes(value)
}

export function slugifyArticleTitle(title: string) {
	return slugify(title, {
		lowercase: true,
		separator: '-',
		allowedChars: 'a-zA-Z0-9',
	})
}

export function normalizeArticleInput(input: ArticleInput): ArticleInput {
	const title = input.title.trim()
	const type = input.type
	const description = input.description?.trim() ?? ''
	const content = input.content ?? ''
	const cover_url = input.cover_url?.trim() || null
	const company_id = input.company_id?.trim() || null
	const status = input.status ?? 'draft'
	const category = input.category ?? 'other'
	const tags = [...new Set(input.tags ?? [])]
	const related_mode = input.related_mode ?? 'auto'
	const related_article_ids = [...new Set(input.related_article_ids ?? [])]
	const priority = Number.isFinite(input.priority) ? Number(input.priority) : 0

	const slug =
		type === 'article'
			? (input.slug?.trim() || slugifyArticleTitle(title)).toLowerCase() || null
			: null
	const external_url =
		type === 'link' ? input.external_url?.trim() || null : null

	return {
		title,
		description,
		content,
		cover_url,
		company_id,
		type,
		status,
		slug,
		external_url,
		category,
		tags,
		related_mode,
		related_article_ids,
		priority,
	}
}

export function validateArticleInput(input: ArticleInput) {
	const data = normalizeArticleInput(input)
	const errors: Partial<Record<keyof ArticleInput, string>> = {}

	if (!data.title) errors.title = 'Укажите title'
	if (!isArticleType(data.type)) errors.type = 'Некорректный type'
	if (data.status && !isArticleStatus(data.status)) {
		errors.status = 'Некорректный status'
	}
	if (data.category && !isArticleCategory(data.category)) {
		errors.category = 'Некорректная category'
	}
	if ((data.tags ?? []).some((tag) => !isArticleTag(tag))) {
		errors.tags = 'Некорректные tags'
	}

	if (data.type === 'article') {
		if (!data.slug) errors.slug = 'Укажите slug'
		else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
			errors.slug = 'Только a-z, 0-9 и дефисы'
		}
	}

	if (data.type === 'link') {
		if (!data.external_url) errors.external_url = 'Укажите ссылку'
		else {
			try {
				new URL(data.external_url)
			} catch {
				errors.external_url = 'Некорректный URL'
			}
		}
	}

	return { data, errors, ok: Object.keys(errors).length === 0 }
}
