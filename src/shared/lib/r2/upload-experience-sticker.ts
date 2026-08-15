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

/** Upload experience sticker to Cloudflare R2 and return public CDN URL. */
export async function uploadExperienceSticker(
	file: File,
	experienceId?: string,
): Promise<UploadAssetResult> {
	const mime = file.type || 'application/octet-stream'
	const ext = extensionFromMime(mime)
	const id = crypto.randomUUID()
	const key = experienceId
		? `experiences/${experienceId}/sticker-${id}.${ext}`
		: `experiences/stickers/sticker-${id}.${ext}`

	return uploadAsset({ file, key })
}
