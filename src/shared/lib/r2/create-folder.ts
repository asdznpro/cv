import 'server-only'

import { PutObjectCommand } from '@aws-sdk/client-s3'

import { getR2Bucket, getR2Client } from './client'
import { assertSafeKey, joinKey, normalizePrefix } from './keys'

/** Create an empty folder marker (`path/`). */
export async function createFolder(prefix: string, name: string) {
	const key = joinKey(normalizePrefix(prefix), name, true)
	assertSafeKey(key)

	await getR2Client().send(
		new PutObjectCommand({
			Bucket: getR2Bucket(),
			Key: key,
			Body: Buffer.alloc(0),
			ContentType: 'application/x-directory',
		}),
	)

	return { prefix: key }
}
