import 'server-only'

import { S3Client } from '@aws-sdk/client-s3'

function requireEnv(name: string) {
	const value = process.env[name]
	if (!value) throw new Error(`${name} is not set`)
	return value
}

let client: S3Client | null = null

export function getR2Client() {
	if (!client) {
		client = new S3Client({
			region: 'auto',
			endpoint: requireEnv('R2_ENDPOINT'),
			credentials: {
				accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
				secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
			},
		})
	}
	return client
}

export function getR2Bucket() {
	return requireEnv('R2_BUCKET')
}

export function getCdnBaseUrl() {
	return requireEnv('NEXT_PUBLIC_CDN_URL').replace(/\/$/, '')
}

export function cdnUrlForKey(key: string) {
	return `${getCdnBaseUrl()}/${key}`
}
