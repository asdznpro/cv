const FALLBACK_URL = 'https://cv.asdzn.pro/'
const VID_COOKIE = 'vid'
const VID_MAX_AGE = 60 * 60 * 24 * 365
const VID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function sha256Hex(value) {
	const data = new TextEncoder().encode(value)
	const digest = await crypto.subtle.digest('SHA-256', data)
	return [...new Uint8Array(digest)]
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('')
}

function readVid(request) {
	const raw = request.headers.get('Cookie') || ''
	const match = raw.match(/(?:^|;\s*)vid=([^;]+)/i)
	const value = match?.[1]?.trim()
	return value && VID_PATTERN.test(value) ? value.toLowerCase() : null
}

function redirectWithVid(url, vid) {
	return new Response(null, {
		status: 302,
		headers: {
			Location: url,
			'Set-Cookie': `${VID_COOKIE}=${vid}; Path=/; Max-Age=${VID_MAX_AGE}; Secure; HttpOnly; SameSite=Lax`,
		},
	})
}

async function visitorHash(_request, salt, vid) {
	return sha256Hex(`${salt}:vid:${vid}`)
}

function isJunkBrand(brand) {
	if (!brand) return true

	// Chrome "greases" Not-A-Brand with random punctuation: Not;A=Brand, Not/A)Brand, …
	const compact = brand.toLowerCase().replace(/[^a-z0-9]/g, '')
	if (compact.includes('not') && compact.includes('brand')) return true
	if (compact === 'chromium') return true

	return false
}

function normalizeBrowserName(brand) {
	const value = brand.trim()
	if (/chrome/i.test(value) && !/chromium/i.test(value)) return 'Chrome'
	if (/edge/i.test(value)) return 'Edge'
	if (/opera|opr/i.test(value)) return 'Opera'
	if (/firefox/i.test(value)) return 'Firefox'
	if (/safari/i.test(value)) return 'Safari'
	return value
}

function parseClientHintBrand(header) {
	if (!header) return null

	// "Chromium";v="120", "Google Chrome";v="120", "Not;A=Brand";v="8"
	const brands = [...header.matchAll(/"([^"]+)";v="(\d+)"/g)].map(match => ({
		brand: match[1],
		version: match[2],
	}))

	const preferred = brands.find(item => !isJunkBrand(item.brand))
	return preferred ? normalizeBrowserName(preferred.brand) : null
}

function browserFromUserAgent(ua) {
	if (/Edg\//.test(ua)) return 'Edge'
	if (/OPR\/|Opera/.test(ua)) return 'Opera'
	if (/Chrome\//.test(ua) || /CriOS\//.test(ua)) return 'Chrome'
	if (/Firefox\//.test(ua) || /FxiOS\//.test(ua)) return 'Firefox'
	if (/Safari\//.test(ua) && !/Chrome\//.test(ua) && !/CriOS\//.test(ua)) {
		return 'Safari'
	}
	if (/MSIE |Trident\//.test(ua)) return 'IE'
	return 'Unknown'
}

function parseUserAgent(ua, hints) {
	let browser = hints.brand || browserFromUserAgent(ua)
	let os = hints.platform || 'Unknown'
	let device = 'desktop'

	if (!hints.brand) {
		browser = browserFromUserAgent(ua)
	}

	if (!hints.platform) {
		if (/Windows/i.test(ua)) os = 'Windows'
		else if (/Android/i.test(ua)) os = 'Android'
		else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'
		else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS'
		else if (/Linux/i.test(ua)) os = 'Linux'
	}

	if (hints.mobile === '?1' || /Mobile|Android.*Mobile|iPhone|iPod/i.test(ua)) {
		device = 'mobile'
	} else if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) {
		device = 'tablet'
	}

	return { browser, os, device }
}

function refererHost(value) {
	if (!value) return null
	try {
		return new URL(value).host || null
	} catch {
		return value.slice(0, 255)
	}
}

function primaryLanguage(header) {
	if (!header) return null
	const first = header.split(',')[0]?.trim()
	return first ? first.slice(0, 64) : null
}

function collectVisitMeta(request) {
	const ua = request.headers.get('User-Agent') || ''
	const cf = request.cf || {}

	const hints = {
		brand: parseClientHintBrand(request.headers.get('Sec-CH-UA')),
		mobile: request.headers.get('Sec-CH-UA-Mobile'),
		platform:
			request.headers.get('Sec-CH-UA-Platform')?.replace(/^"|"$/g, '') || null,
	}

	const { browser, os, device } = parseUserAgent(ua, hints)

	return {
		country: cf.country || request.headers.get('CF-IPCountry') || null,
		city: cf.city || null,
		asn: typeof cf.asn === 'number' ? cf.asn : null,
		as_org: cf.asOrganization || null,
		browser,
		os,
		device,
		referer: refererHost(request.headers.get('Referer')),
		accept_language: primaryLanguage(request.headers.get('Accept-Language')),
		bot_score:
			typeof cf.botManagement?.score === 'number'
				? cf.botManagement.score
				: null,
	}
}

async function recordHit(env, slug, hash, meta) {
	const endpoint = new URL(
		'/rest/v1/rpc/record_short_link_hit',
		env.SUPABASE_URL,
	)

	await fetch(endpoint, {
		method: 'POST',
		headers: {
			apikey: env.SUPABASE_ANON_KEY,
			Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
			'Content-Type': 'application/json',
			Prefer: 'return=minimal',
		},
		body: JSON.stringify({
			p_slug: slug,
			p_visitor_hash: hash,
			p_country: meta.country,
			p_city: meta.city,
			p_asn: meta.asn,
			p_as_org: meta.as_org,
			p_browser: meta.browser,
			p_os: meta.os,
			p_device: meta.device,
			p_referer: meta.referer,
			p_accept_language: meta.accept_language,
			p_bot_score: meta.bot_score,
		}),
	})
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)
		const slug = url.pathname.replace(/^\/+|\/+$/g, '')
		const fallback = env.FALLBACK_URL || FALLBACK_URL

		if (!slug) {
			return Response.redirect(fallback, 302)
		}

		const supabaseUrl = env.SUPABASE_URL
		const anonKey = env.SUPABASE_ANON_KEY

		if (!supabaseUrl || !anonKey) {
			return new Response('Worker misconfigured', { status: 500 })
		}

		const endpoint = new URL('/rest/v1/short_links', supabaseUrl)
		endpoint.searchParams.set('slug', `eq.${slug}`)
		endpoint.searchParams.set('select', 'target_url')
		endpoint.searchParams.set('limit', '1')

		const response = await fetch(endpoint, {
			headers: {
				apikey: anonKey,
				Authorization: `Bearer ${anonKey}`,
				Accept: 'application/json',
			},
		})

		if (!response.ok) {
			return new Response('Upstream error', { status: 502 })
		}

		const rows = await response.json()
		const target = rows?.[0]?.target_url

		if (!target) {
			return Response.redirect(fallback, 302)
		}

		const salt = env.VISITOR_HASH_SALT || anonKey
		const vid = readVid(request) ?? crypto.randomUUID()
		const hash = await visitorHash(request, salt, vid)
		const meta = collectVisitMeta(request)

		ctx.waitUntil(recordHit(env, slug, hash, meta).catch(() => {}))

		return redirectWithVid(target, vid)
	},
}
