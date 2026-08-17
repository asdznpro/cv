const SPOTIFY_TYPES = [
	'playlist',
	'album',
	'track',
	'episode',
	'show',
	'artist',
] as const

export type SpotifyEmbedType = (typeof SPOTIFY_TYPES)[number]
export type SpotifyEmbedTheme = 'dark' | 'color'

export type SpotifyEmbed = {
	type: SpotifyEmbedType
	id: string
	compact: boolean
	theme: SpotifyEmbedTheme
}

const TYPE_PATTERN = SPOTIFY_TYPES.join('|')
const ID_PATTERN = '[A-Za-z0-9]{10,}'

const URL_RE = new RegExp(
	`(?:https?:\\/\\/)?open\\.spotify\\.com\\/(?:embed\\/)?(?:intl-[a-z]{2}\\/)?(${TYPE_PATTERN})\\/(${ID_PATTERN})`,
	'i',
)

const URI_RE = new RegExp(`^spotify:(${TYPE_PATTERN}):(${ID_PATTERN})$`, 'i')

const IFRAME_SRC_RE =
	/src=["'](https:\/\/open\.spotify\.com\/embed\/[^"']+)["']/i

const FLAG_RE = /^(compact|standard|color|dark)$/i

export function isSpotifyType(value: string): value is SpotifyEmbedType {
	return SPOTIFY_TYPES.includes(value.toLowerCase() as SpotifyEmbedType)
}

function toEmbed(
	type: string,
	id: string,
	compact: boolean,
	theme: SpotifyEmbedTheme,
): SpotifyEmbed | null {
	if (!isSpotifyType(type) || !id) return null
	return {
		type: type.toLowerCase() as SpotifyEmbedType,
		id,
		compact,
		theme,
	}
}

function inferCompact(source: string) {
	return /height=["']?152\b/i.test(source)
}

function inferTheme(source: string): SpotifyEmbedTheme {
	if (/[?&]theme=0(?:&|$)/i.test(source)) return 'dark'
	if (/\/embed\//i.test(source)) return 'color'
	return 'dark'
}

export function parseSpotifyRef(
	raw: string,
	options?: { compact?: boolean; theme?: SpotifyEmbedTheme },
): SpotifyEmbed | null {
	const value = raw.trim()
	if (!value) return null

	const iframeSrc = value.match(IFRAME_SRC_RE)?.[1]
	const source = iframeSrc ?? value
	const compact = options?.compact ?? inferCompact(value)
	const theme = options?.theme ?? inferTheme(source)

	const url = source.match(URL_RE)
	if (url) return toEmbed(url[1], url[2], compact, theme)

	const uri = source.match(URI_RE)
	if (uri) return toEmbed(uri[1], uri[2], compact, theme)

	return null
}

/** `spotify [compact|standard] [color|dark] <url|uri>` or a bare Spotify URL / pasted iframe. */
export function parseSpotifyParagraph(text: string): SpotifyEmbed | null {
	const value = text.trim()
	if (!value) return null

	const tokens = value.split(/\s+/)
	if (tokens[0].toLowerCase() !== 'spotify') {
		return parseSpotifyRef(value)
	}

	let index = 1
	let compact: boolean | undefined
	let theme: SpotifyEmbedTheme | undefined

	while (index < tokens.length && FLAG_RE.test(tokens[index])) {
		const flag = tokens[index].toLowerCase()
		if (flag === 'compact') compact = true
		if (flag === 'standard') compact = false
		if (flag === 'color' || flag === 'dark') theme = flag
		index += 1
	}

	return parseSpotifyRef(tokens.slice(index).join(' '), { compact, theme })
}

export function spotifyEmbedSrc(embed: SpotifyEmbed) {
	const params = new URLSearchParams({ utm_source: 'generator' })
	if (embed.theme === 'dark') params.set('theme', '0')
	return `https://open.spotify.com/embed/${embed.type}/${embed.id}?${params}`
}

export function spotifyEmbedHeight(embed: SpotifyEmbed) {
	return embed.compact ? 152 : 352
}
