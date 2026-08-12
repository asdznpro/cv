import 'server-only'

import { ListObjectsV2Command } from '@aws-sdk/client-s3'

import { cdnUrlForKey, getR2Bucket, getR2Client } from './client'
import { displayNameFromKey, normalizePrefix } from './keys'
import type { AssetFile, AssetFolder, AssetListResult } from './types'

export async function listAssets(
	prefixInput = '',
	cursor?: string,
): Promise<AssetListResult> {
	const prefix = normalizePrefix(prefixInput)
	const bucket = getR2Bucket()

	const response = await getR2Client().send(
		new ListObjectsV2Command({
			Bucket: bucket,
			Prefix: prefix || undefined,
			Delimiter: '/',
			ContinuationToken: cursor || undefined,
			MaxKeys: 200,
		}),
	)

	const folders: AssetFolder[] = (response.CommonPrefixes ?? [])
		.map((item) => item.Prefix)
		.filter((value): value is string => Boolean(value))
		.map((folderPrefix) => ({
			prefix: folderPrefix,
			name: displayNameFromKey(folderPrefix, prefix),
		}))
		.sort((a, b) => a.name.localeCompare(b.name))

	const files: AssetFile[] = (response.Contents ?? [])
		.filter((item) => {
			if (!item.Key) return false
			if (item.Key === prefix) return false
			if (item.Key.endsWith('/')) return false
			return true
		})
		.map((item) => {
			const key = item.Key as string
			return {
				key,
				name: displayNameFromKey(key, prefix),
				size: item.Size ?? 0,
				lastModified: item.LastModified
					? item.LastModified.toISOString()
					: null,
				url: cdnUrlForKey(key),
			}
		})
		.sort((a, b) => a.name.localeCompare(b.name))

	return {
		prefix,
		folders,
		files,
		isTruncated: Boolean(response.IsTruncated),
	}
}
