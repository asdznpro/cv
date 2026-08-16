import 'server-only'

import type { UploadAssetResult } from './upload-asset'
import { uploadAsset } from './upload-asset'

function extensionFromMime(mime: string) {
	switch (mime) {
		case 'image/jpeg':
			return 'jpg'
		case 'image/png':
			return 'png'
		case 'image/gif':
			return 'gif'
		case 'image/webp':
			return 'webp'
		case 'image/svg+xml':
			return 'svg'
		default:
			return 'bin'
	}
}

export type ToolkitImageKind = 'lockup' | 'icon'

/** Upload toolkit lockup or icon to Cloudflare R2 and return public CDN URL. */
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
