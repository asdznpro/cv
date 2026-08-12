/** Normalize folder prefix: '' or 'foo/bar/' (no leading slash). */
export function normalizePrefix(prefix = '') {
	const trimmed = prefix
		.trim()
		.replace(/^\/+/, '')
		.replace(/\/{2,}/g, '/')
	if (!trimmed) return ''
	return trimmed.endsWith('/') ? trimmed : `${trimmed}/`
}

/** Join prefix + name into a safe object key (file) or folder prefix. */
export function joinKey(prefix: string, name: string, asFolder = false) {
	const base = normalizePrefix(prefix)
	const segment = name.trim().replace(/^\/+|\/+$/g, '')
	assertSafeKeySegment(segment)
	const key = `${base}${segment}`
	return asFolder ? normalizePrefix(key) : key
}

export function assertSafeKey(key: string) {
	if (!key || key.startsWith('/') || key.includes('..') || key.includes('\\')) {
		throw new Error('Invalid key')
	}
	if (key.length > 1024) {
		throw new Error('Key too long')
	}
}

export function assertSafeKeySegment(name: string) {
	if (!name) throw new Error('Name is required')
	if (name.includes('/') || name.includes('\\') || name.includes('..')) {
		throw new Error('Name must not contain path separators')
	}
}

export function parentPrefix(prefix: string) {
	const normalized = normalizePrefix(prefix)
	if (!normalized) return null
	const parts = normalized.slice(0, -1).split('/')
	parts.pop()
	return parts.length ? `${parts.join('/')}/` : ''
}

export function breadcrumbSegments(prefix: string) {
	const normalized = normalizePrefix(prefix)
	if (!normalized) return [] as { label: string; prefix: string }[]

	const parts = normalized.slice(0, -1).split('/')
	return parts.map((label, index) => ({
		label,
		prefix: `${parts.slice(0, index + 1).join('/')}/`,
	}))
}

export function displayNameFromKey(key: string, prefix: string) {
	const base = normalizePrefix(prefix)
	const relative = key.startsWith(base) ? key.slice(base.length) : key
	return relative.replace(/\/$/, '') || key
}

/** Map R2 prefix ↔ /admin/assets/... path. */
export function hrefForAssetsPrefix(prefix: string) {
	const normalized = normalizePrefix(prefix)
	if (!normalized) return '/admin/assets'
	return `/admin/assets/${normalized.slice(0, -1)}`
}

export function prefixFromAssetsPath(segments?: string[]) {
	if (!segments?.length) return ''
	for (const segment of segments) {
		assertSafeKeySegment(segment)
	}
	return normalizePrefix(segments.join('/'))
}
