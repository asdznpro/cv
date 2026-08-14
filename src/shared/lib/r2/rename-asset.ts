import 'server-only'

import { CopyObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

import { cdnUrlForKey, getR2Bucket, getR2Client } from './client'
import { deleteAssets } from './delete-assets'
import { destAssetFileName, extensionFromFileName } from './file-name'
import { assertSafeKey, joinKey } from './keys'

function encodeCopySource(bucket: string, key: string) {
	return `${bucket}/${key.split('/').map(encodeURIComponent).join('/')}`
}

function isNotFound(error: unknown) {
	if (!error || typeof error !== 'object') return false
	const typed = error as {
		name?: string
		$metadata?: { httpStatusCode?: number }
	}
	return (
		typed.name === 'NotFound' ||
		typed.name === 'NoSuchKey' ||
		typed.$metadata?.httpStatusCode === 404
	)
}

export async function renameAsset(fromKey: string, proposedName: string) {
	assertSafeKey(fromKey)
	if (fromKey.endsWith('/')) {
		throw new Error('Folders cannot be renamed this way')
	}

	const slash = fromKey.lastIndexOf('/')
	const prefix = slash === -1 ? '' : fromKey.slice(0, slash + 1)
	const oldName = slash === -1 ? fromKey : fromKey.slice(slash + 1)
	const fallbackExt = extensionFromFileName(oldName) || 'bin'
	const destName = destAssetFileName(proposedName, fallbackExt)
	const toKey = joinKey(prefix, destName)

	if (toKey === fromKey) {
		return { key: fromKey, url: cdnUrlForKey(fromKey) }
	}

	assertSafeKey(toKey)

	const bucket = getR2Bucket()
	const client = getR2Client()

	try {
		await client.send(new HeadObjectCommand({ Bucket: bucket, Key: toKey }))
		throw new Error('A file with this name already exists')
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === 'A file with this name already exists'
		) {
			throw error
		}
		if (!isNotFound(error)) throw error
	}

	await client.send(
		new CopyObjectCommand({
			Bucket: bucket,
			CopySource: encodeCopySource(bucket, fromKey),
			Key: toKey,
			MetadataDirective: 'COPY',
		}),
	)

	await deleteAssets([fromKey])

	return { key: toKey, url: cdnUrlForKey(toKey) }
}
