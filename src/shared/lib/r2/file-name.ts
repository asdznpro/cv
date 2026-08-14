import { slugify } from 'transliteration'

const SLUGIFY_OPTIONS = {
	lowercase: true,
	separator: '-',
	allowedChars: 'a-zA-Z0-9',
} as const

const MAX_STEM_LENGTH = 48

export function extensionFromFileName(name: string) {
	const match = name.match(/\.([a-z0-9]+)$/i)
	return match?.[1]?.toLowerCase()
}

export function slugifyAssetStem(value: string) {
	return slugify(value, SLUGIFY_OPTIONS)
		.replace(/^-+|-+$/g, '')
		.slice(0, MAX_STEM_LENGTH)
		.replace(/-+$/g, '')
}

/** `original-name-a1b2c3d4.svg` — keeps the local stem, short hash avoids collisions. */
export function uniqueAssetFileName(originalName: string, fallbackExt: string) {
	const ext = extensionFromFileName(originalName) || fallbackExt
	const rawStem = originalName.replace(/\.[^.]+$/, '')
	const stem = slugifyAssetStem(rawStem) || 'file'
	const hash = crypto.randomUUID().slice(0, 8)
	return `${stem}-${hash}.${ext}`
}

/** Sanitize a user-provided name for rename. Keeps original extension if omitted. */
export function destAssetFileName(proposedName: string, fallbackExt: string) {
	const providedExt = extensionFromFileName(proposedName)
	const rawStem = providedExt
		? proposedName.replace(/\.[^.]+$/, '')
		: proposedName
	const stem = slugifyAssetStem(rawStem) || 'file'
	const ext = providedExt || fallbackExt
	return `${stem}.${ext}`
}
