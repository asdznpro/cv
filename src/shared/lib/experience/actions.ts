'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminSession } from 'lib/auth'
import { createAdminClient } from 'lib/supabase/admin'
import { createClient } from 'lib/supabase/server'

import { uploadExperienceSticker } from './upload'

import {
	type Experience,
	type ExperienceInput,
	type ExperienceSticker,
	isExperiencePosition,
	validateExperienceInput,
	yearMonthFromDate,
} from './types'

export type ActionResult =
	| { ok: true; experience?: Experience; url?: string }
	| { ok: false; error: string; fieldErrors?: Record<string, string> }

const EXPERIENCE_SELECT = `
  *,
  company:companies (
    id,
    name,
    slug,
    logo,
    url,
    summary
  ),
  article:articles (
    id,
    title,
    slug
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

function parseStickers(value: unknown): ExperienceSticker[] {
	if (!Array.isArray(value)) return []
	return value
		.map((item) => {
			if (!item || typeof item !== 'object') return null
			const row = item as { url?: unknown; rotate?: unknown }
			const url = typeof row.url === 'string' ? row.url.trim() : ''
			if (!url) return null
			const rotate = Number(row.rotate)
			return {
				url,
				rotate: Number.isFinite(rotate) ? rotate : 0,
			}
		})
		.filter((item): item is ExperienceSticker => Boolean(item))
		.slice(0, 3)
}

function mapExperience(row: Record<string, unknown>): Experience {
	const company = row.company
	const article = row.article
	return {
		id: String(row.id),
		company_id: String(row.company_id),
		company:
			company && typeof company === 'object'
				? (company as Experience['company'])
				: null,
		employment_type: row.employment_type as Experience['employment_type'],
		positions: Array.isArray(row.positions)
			? row.positions.filter(
					(item): item is Experience['positions'][number] =>
						typeof item === 'string' && isExperiencePosition(item),
				)
			: [],
		summary: String(row.summary ?? ''),
		start_on: yearMonthFromDate(String(row.start_on)),
		end_on: row.end_on ? yearMonthFromDate(String(row.end_on)) : null,
		stickers: parseStickers(row.stickers),
		skills: Array.isArray(row.skills) ? row.skills.map(String) : [],
		article_id: row.article_id ? String(row.article_id) : null,
		article:
			article && typeof article === 'object'
				? (article as Experience['article'])
				: null,
		priority: Number(row.priority ?? 0),
		created_at: String(row.created_at),
		updated_at: String(row.updated_at),
	}
}

function revalidateExperience(id?: string) {
	revalidatePath('/admin/experience')
	revalidatePath('/')
	if (id) revalidatePath(`/admin/experience/${id}`)
}

export async function listExperiences(): Promise<Experience[]> {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('experiences')
		.select(EXPERIENCE_SELECT)
		.order('priority', { ascending: false })
		.order('start_on', { ascending: false })

	if (error) throw new Error(error.message)
	return (data ?? []).map((row) =>
		mapExperience(row as Record<string, unknown>),
	)
}

export async function listAdminExperiences(): Promise<Experience[]> {
	if (!(await assertAdmin())) {
		throw new Error('Unauthorized')
	}

	const supabase = createAdminClient()
	const { data, error } = await supabase
		.from('experiences')
		.select(EXPERIENCE_SELECT)
		.order('priority', { ascending: false })
		.order('start_on', { ascending: false })

	if (error) throw new Error(error.message)
	return (data ?? []).map((row) =>
		mapExperience(row as Record<string, unknown>),
	)
}

export async function getAdminExperience(
	id: string,
): Promise<Experience | null> {
	if (!(await assertAdmin())) {
		throw new Error('Unauthorized')
	}

	if (!id) return null

	const supabase = createAdminClient()
	const { data, error } = await supabase
		.from('experiences')
		.select(EXPERIENCE_SELECT)
		.eq('id', id)
		.maybeSingle()

	if (error) throw new Error(error.message)
	if (!data) return null
	return mapExperience(data as Record<string, unknown>)
}

export async function createExperience(
	input: ExperienceInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const { data, errors, ok } = validateExperienceInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	try {
		const { priority: _priority, ...payload } = data
		const supabase = createAdminClient()
		const { data: experience, error } = await supabase
			.from('experiences')
			.insert(payload)
			.select(EXPERIENCE_SELECT)
			.single()

		if (error) return { ok: false, error: error.message }

		const mapped = mapExperience(experience as Record<string, unknown>)
		revalidateExperience(mapped.id)
		return { ok: true, experience: mapped }
	} catch (error) {
		return toActionError(error)
	}
}

export async function updateExperience(
	id: string,
	input: ExperienceInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) return { ok: false, error: 'Не указан id опыта' }

	const { data, errors, ok } = validateExperienceInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	try {
		const { priority: _priority, ...payload } = data
		const supabase = createAdminClient()
		const { data: experience, error } = await supabase
			.from('experiences')
			.update(payload)
			.eq('id', id)
			.select(EXPERIENCE_SELECT)
			.single()

		if (error) return { ok: false, error: error.message }

		revalidateExperience(id)
		return {
			ok: true,
			experience: mapExperience(experience as Record<string, unknown>),
		}
	} catch (error) {
		return toActionError(error)
	}
}

export async function deleteExperience(id: string): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) return { ok: false, error: 'Не указан id опыта' }

	try {
		const supabase = createAdminClient()
		const { error } = await supabase.from('experiences').delete().eq('id', id)
		if (error) return { ok: false, error: error.message }

		revalidateExperience(id)
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function applyExperiencePlacement(
	experienceId: string,
	placeAfterId: string | null,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!experienceId) return { ok: false, error: 'Не указан id опыта' }

	try {
		const supabase = createAdminClient()
		const { data, error } = await supabase
			.from('experiences')
			.select('id')
			.order('priority', { ascending: false })
			.order('start_on', { ascending: false })

		if (error) return { ok: false, error: error.message }

		const others = (data ?? [])
			.map((row) => row.id as string)
			.filter((id) => id !== experienceId)

		let ordered: string[]
		if (!placeAfterId) {
			ordered = [experienceId, ...others]
		} else {
			const index = others.indexOf(placeAfterId)
			if (index === -1) {
				ordered = [experienceId, ...others]
			} else {
				ordered = [
					...others.slice(0, index + 1),
					experienceId,
					...others.slice(index + 1),
				]
			}
		}

		for (let index = 0; index < ordered.length; index += 1) {
			const priority = ordered.length - index
			const { error: updateError } = await supabase
				.from('experiences')
				.update({ priority })
				.eq('id', ordered[index])

			if (updateError) return { ok: false, error: updateError.message }
		}

		revalidateExperience(experienceId)
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function uploadExperienceStickerAction(
	formData: FormData,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const file = formData.get('file')
	if (!(file instanceof File) || file.size === 0) {
		return { ok: false, error: 'Файл не выбран' }
	}

	const experienceId = String(formData.get('experienceId') ?? '') || undefined
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
		'image/svg+xml',
	]
	if (!allowed.includes(file.type)) {
		return { ok: false, error: 'Допустимы PNG, JPG, GIF, WebP, SVG' }
	}

	try {
		const uploaded = await uploadExperienceSticker(file, experienceId)
		return { ok: true, url: uploaded.url }
	} catch (error) {
		return toActionError(error)
	}
}
