'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminSession } from 'lib/auth'
import { createAdminClient } from 'lib/supabase/admin'
import { createClient } from 'lib/supabase/server'

import { uploadToolkitImage, type ToolkitImageKind } from './upload'

import {
	type ToolkitItem,
	type ToolkitItemInput,
	isToolkitTag,
	validateToolkitInput,
} from './types'

export type ActionResult =
	| { ok: true; item?: ToolkitItem; url?: string }
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

function mapToolkitItem(row: Record<string, unknown>): ToolkitItem {
	return {
		id: String(row.id),
		slug: String(row.slug),
		name: String(row.name),
		area: row.area as ToolkitItem['area'],
		tags: Array.isArray(row.tags)
			? row.tags.filter(
					(item): item is ToolkitItem['tags'][number] =>
						typeof item === 'string' && isToolkitTag(item),
				)
			: [],
		proficiency: row.proficiency as ToolkitItem['proficiency'],
		color: String(row.color),
		summary: String(row.summary ?? ''),
		image: {
			lockup: {
				url: String(row.lockup_url),
				size: {
					width: Number(row.lockup_width),
					height: Number(row.lockup_height),
				},
				label: Boolean(row.show_label),
			},
			icon: {
				url: String(row.icon_url),
			},
		},
		priority: Number(row.priority ?? 0),
		created_at: String(row.created_at),
		updated_at: String(row.updated_at),
	}
}

function toRow(input: ReturnType<typeof validateToolkitInput>['data']) {
	const { priority: _priority, ...payload } = input
	return payload
}

function revalidateToolkit(id?: string) {
	revalidatePath('/admin/toolkit')
	revalidatePath('/skills')
	revalidatePath('/')
	if (id) revalidatePath(`/admin/toolkit/${id}`)
}

async function queryToolkitItems(
	client: Awaited<ReturnType<typeof createClient>>,
) {
	const { data, error } = await client
		.from('toolkit_items')
		.select('*')
		.order('priority', { ascending: false })
		.order('name', { ascending: true })

	if (error) throw new Error(error.message)
	return (data ?? []).map((row) =>
		mapToolkitItem(row as Record<string, unknown>),
	)
}

export async function listToolkit(): Promise<ToolkitItem[]> {
	const supabase = await createClient()
	return queryToolkitItems(supabase)
}

export async function listAdminToolkit(): Promise<ToolkitItem[]> {
	if (!(await assertAdmin())) {
		throw new Error('Unauthorized')
	}

	return queryToolkitItems(createAdminClient())
}

export async function getAdminToolkitItem(
	id: string,
): Promise<ToolkitItem | null> {
	if (!(await assertAdmin())) {
		throw new Error('Unauthorized')
	}

	if (!id) return null

	const supabase = createAdminClient()
	const { data, error } = await supabase
		.from('toolkit_items')
		.select('*')
		.eq('id', id)
		.maybeSingle()

	if (error) throw new Error(error.message)
	if (!data) return null
	return mapToolkitItem(data as Record<string, unknown>)
}

export async function createToolkitItem(
	input: ToolkitItemInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const { data, errors, ok } = validateToolkitInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	try {
		const supabase = createAdminClient()
		const { data: item, error } = await supabase
			.from('toolkit_items')
			.insert(toRow(data))
			.select('*')
			.single()

		if (error) {
			if (error.code === '23505') {
				return { ok: false, error: 'Инструмент с таким slug уже существует' }
			}
			return { ok: false, error: error.message }
		}

		const mapped = mapToolkitItem(item as Record<string, unknown>)
		revalidateToolkit(mapped.id)
		return { ok: true, item: mapped }
	} catch (error) {
		return toActionError(error)
	}
}

export async function updateToolkitItem(
	id: string,
	input: ToolkitItemInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) return { ok: false, error: 'Не указан id инструмента' }

	const { data, errors, ok } = validateToolkitInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	try {
		const supabase = createAdminClient()
		const { data: item, error } = await supabase
			.from('toolkit_items')
			.update(toRow(data))
			.eq('id', id)
			.select('*')
			.single()

		if (error) {
			if (error.code === '23505') {
				return { ok: false, error: 'Инструмент с таким slug уже существует' }
			}
			return { ok: false, error: error.message }
		}

		revalidateToolkit(id)
		return {
			ok: true,
			item: mapToolkitItem(item as Record<string, unknown>),
		}
	} catch (error) {
		return toActionError(error)
	}
}

export async function deleteToolkitItem(id: string): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) return { ok: false, error: 'Не указан id инструмента' }

	try {
		const supabase = createAdminClient()
		const { error } = await supabase.from('toolkit_items').delete().eq('id', id)
		if (error) return { ok: false, error: error.message }

		revalidateToolkit(id)
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function applyToolkitPlacement(
	itemId: string,
	placeAfterId: string | null,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!itemId) return { ok: false, error: 'Не указан id инструмента' }

	try {
		const supabase = createAdminClient()
		const { data, error } = await supabase
			.from('toolkit_items')
			.select('id')
			.order('priority', { ascending: false })
			.order('name', { ascending: true })

		if (error) return { ok: false, error: error.message }

		const others = (data ?? [])
			.map((row) => row.id as string)
			.filter((id) => id !== itemId)

		let ordered: string[]
		if (!placeAfterId) {
			ordered = [itemId, ...others]
		} else {
			const index = others.indexOf(placeAfterId)
			if (index === -1) {
				ordered = [itemId, ...others]
			} else {
				ordered = [
					...others.slice(0, index + 1),
					itemId,
					...others.slice(index + 1),
				]
			}
		}

		for (let index = 0; index < ordered.length; index += 1) {
			const priority = ordered.length - index
			const { error: updateError } = await supabase
				.from('toolkit_items')
				.update({ priority })
				.eq('id', ordered[index])

			if (updateError) return { ok: false, error: updateError.message }
		}

		revalidateToolkit(itemId)
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function uploadToolkitImageAction(
	formData: FormData,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const file = formData.get('file')
	if (!(file instanceof File) || file.size === 0) {
		return { ok: false, error: 'Файл не выбран' }
	}

	const kind = String(formData.get('kind') ?? '')
	if (kind !== 'lockup' && kind !== 'icon') {
		return { ok: false, error: 'Некорректный тип изображения' }
	}

	const itemId = String(formData.get('itemId') ?? '') || undefined
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
		const uploaded = await uploadToolkitImage(
			file,
			kind as ToolkitImageKind,
			itemId,
		)
		return { ok: true, url: uploaded.url }
	} catch (error) {
		return toActionError(error)
	}
}
