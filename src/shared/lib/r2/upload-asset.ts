import 'server-only'

import { PutObjectCommand } from '@aws-sdk/client-s3'

import { cdnUrlForKey, getR2Bucket, getR2Client } from './client'
import { assertSafeKey, joinKey, normalizePrefix } from './keys'

export type UploadAssetInput = {
	file: File
	prefix?: string
	/** Explicit object key. Overrides prefix + generated name. */
	key?: string
	cacheControl?: string
}

export type UploadAssetResult = {
	key: string
	url: string
}

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
		case 'application/pdf':
			return 'pdf'
		default:
			return 'bin'
	}
}

function extensionFromFileName(name: string) {
	const match = name.match(/\.([a-z0-9]+)$/i)
	return match?.[1]?.toLowerCase()
}

export async function uploadAsset({
	file,
	prefix = '',
	key: explicitKey,
	cacheControl = 'public, max-age=31536000, immutable',
}: UploadAssetInput): Promise<UploadAssetResult> {
	const mime = file.type || 'application/octet-stream'
	const ext =
		extensionFromFileName(file.name) || extensionFromMime(mime) || 'bin'
	const key =
		explicitKey ??
		joinKey(normalizePrefix(prefix), `${crypto.randomUUID()}.${ext}`)

	assertSafeKey(key)

	const body = Buffer.from(await file.arrayBuffer())

	await getR2Client().send(
		new PutObjectCommand({
			Bucket: getR2Bucket(),
			Key: key,
			Body: body,
			ContentType: mime,
			CacheControl: cacheControl,
		}),
	)

	return { key, url: cdnUrlForKey(key) }
}
