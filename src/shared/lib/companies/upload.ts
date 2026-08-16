import 'server-only'

import {
	extensionFromMime,
	uploadAsset,
	type UploadAssetResult,
} from 'lib/r2/upload-asset'

export async function uploadCompanyLogo(
	file: File,
	companyId?: string,
): Promise<UploadAssetResult> {
	const mime = file.type || 'application/octet-stream'
	const ext = extensionFromMime(mime)
	const id = crypto.randomUUID()
	const key = companyId
		? `companies/${companyId}/logo-${id}.${ext}`
		: `companies/logos/logo-${id}.${ext}`

	return uploadAsset({ file, key })
}
