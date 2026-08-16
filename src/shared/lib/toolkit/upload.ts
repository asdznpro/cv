import 'server-only'

import {
	extensionFromMime,
	uploadAsset,
	type UploadAssetResult,
} from 'lib/r2/upload-asset'

export type ToolkitImageKind = 'lockup' | 'icon'

export async function uploadToolkitImage(
	file: File,
	kind: ToolkitImageKind,
	itemId?: string,
): Promise<UploadAssetResult> {
	const mime = file.type || 'application/octet-stream'
	const ext = extensionFromMime(mime)
	const id = crypto.randomUUID()
	const prefix = itemId ? `toolkit/${itemId}` : 'toolkit/drafts'
	const key = `${prefix}/${kind}-${id}.${ext}`

	return uploadAsset({ file, key })
}
