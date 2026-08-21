'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminSession } from 'lib/auth'
import { createAdminClient } from 'lib/supabase/admin'
import { createClient } from 'lib/supabase/server'

import { uploadArticleCover } from './upload'

import {
	type Article,
	type ArticleInput,
	type ArticleListFilter,
	type ArticleStatus,
	validateArticleInput,
} from './types'

export type ActionResult =
	| { ok: true; article?: Article; url?: string }
	| { ok: false; error: string; fieldErrors?: Record<string, string> }

const ARTICLE_SELECT = `
  *,
  company:companies (
    id,
    name,
    slug,
    logo,
    url,
    summary
  )
`

async function assertAdmin() {
	try {
		await requireAdminSession()
	} catch {
		return false
	}
	return true
}

function toActionError(error: unknown): ActionResult {
	const message = error instanceof Error ? error.message : 'Unknown error'
	return { ok: false, error: message }
}

function mapArticle(row: Record<string, unknown>): Article {
	const company = row.company
	return {
		...(row as Omit<
			Article,
			'company' | 'views_24h' | 'uniques_24h' | 'unique_visitors' | 'views'
		>),
		views: Number(row.views ?? 0),
		unique_visitors: Number(row.unique_visitors ?? 0),
		views_24h: Number(row.views_24h ?? 0),
		uniques_24h: Number(row.uniques_24h ?? 0),
		company:
			company && typeof company === 'object'
				? (company as Article['company'])
				: null,
	}
}

async function withArticleStats24h(articles: Article[]): Promise<Article[]> {
	if (articles.length === 0) return articles

	const supabase = await createClient()
	const { data: statsRows, error } = await supabase.rpc('article_stats_24h')

	if (error) {
		return articles.map((article) => ({
			...article,
			views_24h: 0,
			uniques_24h: 0,
		}))
	}

	const statsById = new Map<
		string,
		{ views_24h: number; uniques_24h: number }
	>()

	for (const row of statsRows ?? []) {
		statsById.set(row.article_id as string, {
			views_24h: Number(row.views_24h ?? 0),
			uniques_24h: Number(row.uniques_24h ?? 0),
		})
	}

	return articles.map((article) => {
		const stats = statsById.get(article.id)
		return {
			...article,
			views_24h: stats?.views_24h ?? 0,
			uniques_24h: stats?.uniques_24h ?? 0,
		}
	})
}

export async function listArticles(
	filter: ArticleListFilter = {},
): Promise<Article[]> {
	const supabase = await createClient()
	let query = supabase
		.from('articles')
		.select(ARTICLE_SELECT)
		.order('priority', { ascending: false })
		.order('created_at', { ascending: false })

	if (filter.status && filter.status !== 'all') {
		query = query.eq('status', filter.status)
	}

	const { data, error } = await query
	if (error) throw new Error(error.message)
	return (data ?? []).map((row) => mapArticle(row as Record<string, unknown>))
}

/** Admin list — includes drafts/archived. */
export async function listAdminArticles(
	filter: ArticleListFilter = {},
): Promise<Article[]> {
	if (!(await assertAdmin())) {
		throw new Error('Unauthorized')
	}

	const supabase = createAdminClient()
	let query = supabase
		.from('articles')
		.select(ARTICLE_SELECT)
		.order('priority', { ascending: false })
		.order('created_at', { ascending: false })

	if (filter.status && filter.status !== 'all') {
		query = query.eq('status', filter.status)
	}

	const { data, error } = await query
	if (error) throw new Error(error.message)

	const articles = (data ?? []).map((row) =>
		mapArticle(row as Record<string, unknown>),
	)
	return withArticleStats24h(articles)
}

export async function listAllArticleIds(): Promise<string[]> {
	if (!(await assertAdmin())) {
		throw new Error('Unauthorized')
	}

	const supabase = createAdminClient()
	const { data, error } = await supabase.from('articles').select('id')
	if (error) throw new Error(error.message)
	return (data ?? []).map((row) => row.id as string)
}

export async function getAdminArticle(id: string): Promise<Article | null> {
	if (!(await assertAdmin())) {
		throw new Error('Unauthorized')
	}

	const supabase = createAdminClient()
	const { data, error } = await supabase
		.from('articles')
		.select(ARTICLE_SELECT)
		.eq('id', id)
		.maybeSingle()

	if (error) throw new Error(error.message)
	if (!data) return null
	return mapArticle(data as Record<string, unknown>)
}

/** Public (published) or admin (any status) article by slug. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
	if (!slug) return null

	const isAdmin = await assertAdmin()
	const supabase = isAdmin ? createAdminClient() : await createClient()

	let query = supabase
		.from('articles')
		.select(ARTICLE_SELECT)
		.eq('slug', slug)
		.eq('type', 'article')

	if (!isAdmin) {
		query = query.eq('status', 'published')
	}

	const { data, error } = await query.maybeSingle()
	if (error) throw new Error(error.message)
	if (!data) return null
	return mapArticle(data as Record<string, unknown>)
}

export async function listRelatedArticles(
	article: Article,
	limit = 3,
): Promise<Article[]> {
	const isAdmin = await assertAdmin()
	const supabase = isAdmin ? createAdminClient() : await createClient()

	if (article.related_mode === 'manual' && article.related_article_ids.length) {
		const ids = article.related_article_ids.slice(0, limit)
		const { data, error } = await supabase
			.from('articles')
			.select(ARTICLE_SELECT)
			.in('id', ids)

		if (error) throw new Error(error.message)

		const byId = new Map(
			(data ?? []).map((row) => {
				const mapped = mapArticle(row as Record<string, unknown>)
				return [mapped.id, mapped] as const
			}),
		)

		return ids
			.map((id) => byId.get(id))
			.filter((item): item is Article => Boolean(item))
	}

	let query = supabase
		.from('articles')
		.select(ARTICLE_SELECT)
		.eq('type', 'article')
		.neq('id', article.id)
		.order('priority', { ascending: false })
		.order('created_at', { ascending: false })
		.limit(limit)

	if (!isAdmin) {
		query = query.eq('status', 'published')
	}

	const { data, error } = await query
	if (error) throw new Error(error.message)
	return (data ?? []).map((row) => mapArticle(row as Record<string, unknown>))
}

export async function createArticle(
	input: ArticleInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const { data, errors, ok } = validateArticleInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	try {
		const supabase = createAdminClient()
		const { data: article, error } = await supabase
			.from('articles')
			.insert(data)
			.select(ARTICLE_SELECT)
			.single()

		if (error) {
			if (error.code === '23505') {
				return { ok: false, error: 'Статья с таким slug уже существует' }
			}
			return { ok: false, error: error.message }
		}

		revalidatePath('/admin/articles')
		revalidatePath('/articles')
		return { ok: true, article: mapArticle(article as Record<string, unknown>) }
	} catch (error) {
		return toActionError(error)
	}
}

export async function duplicateArticle(id: string): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) return { ok: false, error: 'Не указан id статьи' }

	try {
		const source = await getAdminArticle(id)
		if (!source) return { ok: false, error: 'Статья не найдена' }

		const suffix = crypto.randomUUID().slice(0, 8)
		const title = `${source.title} (copy)`
		const slug =
			source.type === 'article' && source.slug
				? `${source.slug}-copy-${suffix}`
				: null

		return createArticle({
			title,
			description: source.description,
			content: source.content,
			cover_url: source.cover_url,
			company_id: source.company_id,
			type: source.type,
			status: 'draft',
			slug,
			external_url: source.external_url,
			category: source.category,
			tags: source.tags,
			related_mode: source.related_mode,
			related_article_ids: source.related_article_ids,
			priority: source.priority,
		})
	} catch (error) {
		return toActionError(error)
	}
}

export async function updateArticle(
	id: string,
	input: ArticleInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) return { ok: false, error: 'Не указан id статьи' }

	const { data, errors, ok } = validateArticleInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	try {
		const supabase = createAdminClient()
		const { data: article, error } = await supabase
			.from('articles')
			.update(data)
			.eq('id', id)
			.select(ARTICLE_SELECT)
			.single()

		if (error) {
			if (error.code === '23505') {
				return { ok: false, error: 'Статья с таким slug уже существует' }
			}
			return { ok: false, error: error.message }
		}

		revalidatePath('/admin/articles')
		revalidatePath(`/admin/articles/${id}`)
		revalidatePath('/articles')
		if (data.slug) revalidatePath(`/articles/${data.slug}`)
		return { ok: true, article: mapArticle(article as Record<string, unknown>) }
	} catch (error) {
		return toActionError(error)
	}
}

export async function updateArticlesStatus(
	ids: string[],
	status: ArticleStatus,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (ids.length === 0) {
		return { ok: false, error: 'Не выбраны статьи' }
	}

	try {
		const supabase = createAdminClient()
		const { error } = await supabase
			.from('articles')
			.update({ status })
			.in('id', ids)

		if (error) return { ok: false, error: error.message }

		revalidatePath('/admin/articles')
		revalidatePath('/articles')
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function deleteArticles(ids: string[]): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (ids.length === 0) {
		return { ok: false, error: 'Не выбраны статьи' }
	}

	try {
		const supabase = createAdminClient()
		const { error } = await supabase.from('articles').delete().in('id', ids)
		if (error) return { ok: false, error: error.message }

		revalidatePath('/admin/articles')
		revalidatePath('/articles')
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function deleteArticle(id: string): Promise<ActionResult> {
	return deleteArticles([id])
}

/**
 * Place article at the top (placeAfterId = null) or right after another article.
 * Reassigns dense priorities (n..1) for the full admin list order.
 */
export async function applyArticlePlacement(
	articleId: string,
	placeAfterId: string | null,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!articleId) return { ok: false, error: 'Не указан id статьи' }

	try {
		const supabase = createAdminClient()
		const { data, error } = await supabase
			.from('articles')
			.select('id')
			.order('priority', { ascending: false })
			.order('created_at', { ascending: false })

		if (error) return { ok: false, error: error.message }

		const others = (data ?? [])
			.map((row) => row.id as string)
			.filter((id) => id !== articleId)

		let ordered: string[]
		if (!placeAfterId) {
			ordered = [articleId, ...others]
		} else {
			const index = others.indexOf(placeAfterId)
			if (index === -1) {
				ordered = [articleId, ...others]
			} else {
				ordered = [
					...others.slice(0, index + 1),
					articleId,
					...others.slice(index + 1),
				]
			}
		}

		for (let index = 0; index < ordered.length; index += 1) {
			const priority = ordered.length - index
			const { error: updateError } = await supabase
				.from('articles')
				.update({ priority })
				.eq('id', ordered[index])

			if (updateError) return { ok: false, error: updateError.message }
		}

		revalidatePath('/admin/articles')
		revalidatePath(`/admin/articles/${articleId}`)
		revalidatePath('/articles')
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function uploadCoverAction(
	formData: FormData,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const file = formData.get('file')
	if (!(file instanceof File) || file.size === 0) {
		return { ok: false, error: 'Файл не выбран' }
	}

	const articleId = String(formData.get('articleId') ?? '') || undefined
	const maxSize = 10 * 1024 * 1024
	if (file.size > maxSize) {
		return { ok: false, error: 'Файл больше 10MB' }
	}

	const allowed = [
		'image/png',
		'image/jpeg',
		'image/jpg',
		'image/gif',
		'image/webp',
	]
	if (!allowed.includes(file.type)) {
		return { ok: false, error: 'Допустимы PNG, JPG, GIF, WebP' }
	}

	try {
		const uploaded = await uploadArticleCover(file, articleId)
		return { ok: true, url: uploaded.url }
	} catch (error) {
		return toActionError(error)
	}
}
