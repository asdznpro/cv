import 'server-only'

import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

import { getR2Bucket, getR2Client } from './client'
import { assertSafeKey, normalizePrefix } from './keys'

async function deleteKeys(keys: string[]) {
	const unique = [...new Set(keys)].filter(Boolean)
	unique.forEach(assertSafeKey)
	if (unique.length === 0) return

	const bucket = getR2Bucket()
	const client = getR2Client()

	for (let i = 0; i < unique.length; i += 1000) {
		const chunk = unique.slice(i, i + 1000)
		await client.send(
			new DeleteObjectsCommand({
				Bucket: bucket,
				Delete: {
					Objects: chunk.map((Key) => ({ Key })),
					Quiet: true,
				},
			}),
		)
	}
}

export async function deleteAssets(keys: string[]) {
	await deleteKeys(keys)
}

/** Delete every object under a prefix (folder). */
export async function deleteFolder(prefixInput: string) {
	const prefix = normalizePrefix(prefixInput)
	if (!prefix) throw new Error('Cannot delete bucket root')

	const bucket = getR2Bucket()
	const client = getR2Client()
	let token: string | undefined

	do {
		const page = await client.send(
			new ListObjectsV2Command({
				Bucket: bucket,
				Prefix: prefix,
				ContinuationToken: token,
				MaxKeys: 1000,
			}),
		)

		const keys = (page.Contents ?? [])
			.map((item) => item.Key)
			.filter((key): key is string => Boolean(key))

		if (keys.length) await deleteKeys(keys)
		token = page.IsTruncated ? page.NextContinuationToken : undefined
	} while (token)
}
