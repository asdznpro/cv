export type AssetFolder = {
	prefix: string
	name: string
}

export type AssetFile = {
	key: string
	name: string
	size: number
	lastModified: string | null
	url: string
	contentType?: string
}

export type AssetListResult = {
	prefix: string
	folders: AssetFolder[]
	files: AssetFile[]
	isTruncated: boolean
}

export type R2ActionResult =
	| { ok: true; url?: string; list?: AssetListResult }
	| { ok: false; error: string }
