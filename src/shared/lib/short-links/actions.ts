'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminSession } from 'lib/auth'
import { createAdminClient } from 'lib/supabase/admin'
import { createClient } from 'lib/supabase/server'

import {
	generateShortSlug,
	type ShortLink,
	type ShortLinkClick,
	type ShortLinkInput,
	type ShortLinkVisit,
	validateShortLinkInput,
} from './types'

export type ActionResult =
	| { ok: true; link?: ShortLink }
	| { ok: false; error: string; fieldErrors?: Record<string, string> }

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

export async function listShortLinks(): Promise<ShortLink[]> {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('short_links')
		.select('*')
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(error.message)
	}

	const links = (data ?? []) as Omit<ShortLink, 'clicks_24h' | 'uniques_24h'>[]

	const { data: statsRows, error: statsError } = await supabase.rpc(
		'short_link_stats_24h',
	)

	if (statsError) {
		// Migration not applied yet — show lifetime only
		return links.map(link => ({
			...link,
			unique_visitors: link.unique_visitors ?? 0,
			clicks_24h: 0,
			uniques_24h: 0,
		}))
	}

	const statsById = new Map<
		string,
		{ clicks_24h: number; uniques_24h: number }
	>()

	for (const row of statsRows ?? []) {
		statsById.set(row.link_id as string, {
			clicks_24h: Number(row.clicks_24h ?? 0),
			uniques_24h: Number(row.uniques_24h ?? 0),
		})
	}

	return links.map(link => {
		const stats = statsById.get(link.id)
		return {
			...link,
			unique_visitors: link.unique_visitors ?? 0,
			clicks_24h: stats?.clicks_24h ?? 0,
			uniques_24h: stats?.uniques_24h ?? 0,
		}
	})
}

function mapVisit(
	row: Record<string, unknown>,
	clicks: ShortLinkClick[],
): ShortLinkVisit {
	return {
		id: String(row.id),
		hits: Number(row.hits ?? 1),
		first_seen_at: String(row.first_seen_at),
		last_seen_at: String(row.last_seen_at),
		country: typeof row.country === 'string' ? row.country : null,
		city: typeof row.city === 'string' ? row.city : null,
		as_org: typeof row.as_org === 'string' ? row.as_org : null,
		browser: typeof row.browser === 'string' ? row.browser : null,
		os: typeof row.os === 'string' ? row.os : null,
		device: typeof row.device === 'string' ? row.device : null,
		referer:
			typeof row.referer === 'string' && row.referer ? row.referer : null,
		clicks,
	}
}

export async function listShortLinkVisits(
	linkId: string,
): Promise<
	{ ok: true; visits: ShortLinkVisit[] } | { ok: false; error: string }
> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!linkId) {
		return { ok: false, error: 'Не указан id ссылки' }
	}

	try {
		const supabase = createAdminClient()
		const { data, error } = await supabase
			.from('short_link_visits')
			.select(
				'id, visitor_hash, hits, first_seen_at, last_seen_at, country, city, as_org, browser, os, device, referer',
			)
			.eq('link_id', linkId)
			.order('last_seen_at', { ascending: false })
			.limit(200)

		if (error) {
			return { ok: false, error: error.message }
		}

		const { data: eventRows } = await supabase
			.from('short_link_events')
			.select('id, created_at, visitor_hash')
			.eq('link_id', linkId)
			.order('created_at', { ascending: false })
			.limit(2000)

		const clicksByHash = new Map<string, ShortLinkClick[]>()

		for (const event of eventRows ?? []) {
			const hash = String(event.visitor_hash ?? '')
			if (!hash) continue

			const clicks = clicksByHash.get(hash) ?? []
			clicks.push({
				id: String(event.id),
				created_at: String(event.created_at),
			})
			clicksByHash.set(hash, clicks)
		}

		return {
			ok: true,
			visits: (data ?? []).map(row =>
				mapVisit(
					row as Record<string, unknown>,
					clicksByHash.get(String(row.visitor_hash ?? '')) ?? [],
				),
			),
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return { ok: false, error: message }
	}
}

export async function createShortLink(
	input: ShortLinkInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const { data, errors, ok } = validateShortLinkInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	const slug = data.slug || generateShortSlug()

	try {
		const supabase = createAdminClient()
		const { data: link, error } = await supabase
			.from('short_links')
			.insert({
				slug,
				target_url: data.target_url,
				title: data.title,
			})
			.select('*')
			.single()

		if (error) {
			if (error.code === '23505') {
				return { ok: false, error: 'Ссылка с таким slug уже существует' }
			}
			return { ok: false, error: error.message }
		}

		revalidatePath('/admin/shortener')
		return { ok: true, link: link as ShortLink }
	} catch (error) {
		return toActionError(error)
	}
}

export async function updateShortLink(
	id: string,
	input: ShortLinkInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) {
		return { ok: false, error: 'Не указан id ссылки' }
	}

	const { data, errors, ok } = validateShortLinkInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	if (!data.slug) {
		return {
			ok: false,
			error: 'Проверьте поля формы',
			fieldErrors: { slug: 'Укажите slug' },
		}
	}

	try {
		const supabase = createAdminClient()
		const { data: link, error } = await supabase
			.from('short_links')
			.update({
				slug: data.slug,
				target_url: data.target_url,
				title: data.title,
				updated_at: new Date().toISOString(),
			})
			.eq('id', id)
			.select('*')
			.single()

		if (error) {
			if (error.code === '23505') {
				return { ok: false, error: 'Ссылка с таким slug уже существует' }
			}
			return { ok: false, error: error.message }
		}

		revalidatePath('/admin/shortener')
		return { ok: true, link: link as ShortLink }
	} catch (error) {
		return toActionError(error)
	}
}

export async function deleteShortLink(id: string): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) {
		return { ok: false, error: 'Не указан id ссылки' }
	}

	try {
		const supabase = createAdminClient()
		const { error } = await supabase.from('short_links').delete().eq('id', id)

		if (error) {
			return { ok: false, error: error.message }
		}

		revalidatePath('/admin/shortener')
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}
