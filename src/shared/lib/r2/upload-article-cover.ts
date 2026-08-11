import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

function requireEnv(name: string) {
	const value = process.env[name]
	if (!value) throw new Error(`${name} is not set`)
	return value
}

function getR2Client() {
	return new S3Client({
		region: 'auto',
		endpoint: requireEnv('R2_ENDPOINT'),
		credentials: {
			accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
			secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
		},
	})
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
		default:
			return 'bin'
	}
}

export type UploadCoverResult = {
	key: string
	url: string
}

/** Upload article cover to Cloudflare R2 and return public CDN URL. */
export async function uploadArticleCover(
	file: File,
	articleId?: string,
): Promise<UploadCoverResult> {
	const bucket = requireEnv('R2_BUCKET')
	const cdn = requireEnv('NEXT_PUBLIC_CDN_URL').replace(/\/$/, '')
	const mime = file.type || 'application/octet-stream'
	const ext = extensionFromMime(mime)
	const id = crypto.randomUUID()
	const key = articleId
		? `articles/${articleId}/cover-${id}.${ext}`
		: `articles/covers/cover-${id}.${ext}`

	const body = Buffer.from(await file.arrayBuffer())

	await getR2Client().send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: body,
			ContentType: mime,
			CacheControl: 'public, max-age=31536000, immutable',
		}),
	)

	return {
		key,
		url: `${cdn}/${key}`,
	}
}
