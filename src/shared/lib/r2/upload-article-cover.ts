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
		default:
			return 'bin'
	}
}

/** Upload article cover to Cloudflare R2 and return public CDN URL. */
export async function uploadArticleCover(
	file: File,
	articleId?: string,
): Promise<UploadAssetResult> {
	const mime = file.type || 'application/octet-stream'
	const ext = extensionFromMime(mime)
	const id = crypto.randomUUID()
	const key = articleId
		? `articles/${articleId}/cover-${id}.${ext}`
		: `articles/covers/cover-${id}.${ext}`

	return uploadAsset({ file, key })
}
