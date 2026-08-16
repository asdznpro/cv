import 'server-only'

import {
	extensionFromMime,
	uploadAsset,
	type UploadAssetResult,
} from 'lib/r2/upload-asset'

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
