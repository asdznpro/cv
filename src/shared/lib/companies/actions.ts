'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminSession } from 'lib/auth'
import { uploadCompanyLogo } from 'lib/r2/upload-company-logo'
import { createAdminClient } from 'lib/supabase/admin'
import { createClient } from 'lib/supabase/server'

import { type Company, type CompanyInput, validateCompanyInput } from './types'

export type ActionResult =
	| { ok: true; company?: Company; url?: string }
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

export async function listCompanies(): Promise<Company[]> {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('companies')
		.select('*')
		.order('name', { ascending: true })

	if (error) {
		throw new Error(error.message)
	}

	return (data ?? []) as Company[]
}

export async function createCompany(
	input: CompanyInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const { data, errors, ok } = validateCompanyInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	try {
		const supabase = createAdminClient()
		const { data: company, error } = await supabase
			.from('companies')
			.insert(data)
			.select('*')
			.single()

		if (error) {
			if (error.code === '23505') {
				return { ok: false, error: 'Компания с таким slug уже существует' }
			}
			return { ok: false, error: error.message }
		}

		revalidatePath('/admin/companies')
		return { ok: true, company: company as Company }
	} catch (error) {
		return toActionError(error)
	}
}

export async function updateCompany(
	id: string,
	input: CompanyInput,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) {
		return { ok: false, error: 'Не указан id компании' }
	}

	const { data, errors, ok } = validateCompanyInput(input)
	if (!ok) {
		return { ok: false, error: 'Проверьте поля формы', fieldErrors: errors }
	}

	try {
		const supabase = createAdminClient()
		const { data: company, error } = await supabase
			.from('companies')
			.update(data)
			.eq('id', id)
			.select('*')
			.single()

		if (error) {
			if (error.code === '23505') {
				return { ok: false, error: 'Компания с таким slug уже существует' }
			}
			return { ok: false, error: error.message }
		}

		revalidatePath('/admin/companies')
		return { ok: true, company: company as Company }
	} catch (error) {
		return toActionError(error)
	}
}

export async function deleteCompany(id: string): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) {
		return { ok: false, error: 'Не указан id компании' }
	}

	try {
		const supabase = createAdminClient()
		const { error } = await supabase.from('companies').delete().eq('id', id)

		if (error) {
			return { ok: false, error: error.message }
		}

		revalidatePath('/admin/companies')
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function uploadCompanyLogoAction(
	formData: FormData,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const file = formData.get('file')
	if (!(file instanceof File) || file.size === 0) {
		return { ok: false, error: 'Файл не выбран' }
	}

	const companyId = String(formData.get('companyId') ?? '') || undefined
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
		const uploaded = await uploadCompanyLogo(file, companyId)
		return { ok: true, url: uploaded.url }
	} catch (error) {
		return toActionError(error)
	}
}
