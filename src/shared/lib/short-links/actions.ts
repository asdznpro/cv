'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminSession } from 'lib/auth'
import { createAdminClient } from 'lib/supabase/admin'
import { createClient } from 'lib/supabase/server'

import {
	generateShortSlug,
	type ShortLink,
	type ShortLinkInput,
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

	return (data ?? []) as ShortLink[]
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
