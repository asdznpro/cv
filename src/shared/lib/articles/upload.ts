import 'server-only'

import {
	extensionFromMime,
	uploadAsset,
	type UploadAssetResult,
} from 'lib/r2/upload-asset'

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
