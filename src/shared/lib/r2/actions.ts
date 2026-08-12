'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminSession } from 'lib/auth'

import { createFolder } from './create-folder'
import { deleteAssets, deleteFolder } from './delete-assets'
import { normalizePrefix } from './keys'
import { listAssets } from './list-assets'
import type { AssetListResult, R2ActionResult } from './types'
import { uploadAsset } from './upload-asset'

async function assertAdmin() {
	try {
		await requireAdminSession()
	} catch {
		return false
	}
	return true
}

function toActionError(error: unknown): R2ActionResult {
	const message = error instanceof Error ? error.message : 'Unknown error'
	return { ok: false, error: message }
}

function revalidateAssets() {
	revalidatePath('/admin/assets')
}

export async function listAssetsAction(
	prefix = '',
): Promise<AssetListResult | { error: string }> {
	if (!(await assertAdmin())) {
		return { error: 'Unauthorized' }
	}

	try {
		return await listAssets(prefix)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return { error: message }
	}
}

export async function uploadAssetAction(
	formData: FormData,
): Promise<R2ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	const file = formData.get('file')
	if (!(file instanceof File) || file.size === 0) {
		return { ok: false, error: 'File is required' }
	}

	const maxSize = 20 * 1024 * 1024
	if (file.size > maxSize) {
		return { ok: false, error: 'File larger than 20MB' }
	}

	const prefix = normalizePrefix(String(formData.get('prefix') ?? ''))

	try {
		const uploaded = await uploadAsset({ file, prefix })
		revalidateAssets()
		return { ok: true, url: uploaded.url }
	} catch (error) {
		return toActionError(error)
	}
}

export async function createFolderAction(
	prefix: string,
	name: string,
): Promise<R2ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	try {
		await createFolder(prefix, name)
		revalidateAssets()
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function deleteAssetsAction(
	keys: string[],
): Promise<R2ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!keys.length) {
		return { ok: false, error: 'Nothing to delete' }
	}

	try {
		await deleteAssets(keys)
		revalidateAssets()
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}

export async function deleteFolderAction(
	prefix: string,
): Promise<R2ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	try {
		await deleteFolder(prefix)
		revalidateAssets()
		return { ok: true }
	} catch (error) {
		return toActionError(error)
	}
}
