import {
	SPOTIFY_TYPES,
	type SpotifyEmbed,
	type SpotifyTheme,
	type SpotifyType,
} from './Spotify.interface'

const TYPE_PATTERN = SPOTIFY_TYPES.join('|')
const ID_PATTERN = '[A-Za-z0-9]{10,}'

const URL_RE = new RegExp(
	`(?:https?:\\/\\/)?open\\.spotify\\.com\\/(?:embed\\/)?(?:intl-[a-z]{2}\\/)?(${TYPE_PATTERN})\\/(${ID_PATTERN})`,
	'i',
)

const URI_RE = new RegExp(`^spotify:(${TYPE_PATTERN}):(${ID_PATTERN})$`, 'i')

const IFRAME_SRC_RE =
	/src=["'](https:\/\/open\.spotify\.com\/embed\/[^"']+)["']/i

export function isSpotifyType(value: string): value is SpotifyType {
	return SPOTIFY_TYPES.includes(value.toLowerCase() as SpotifyType)
}

function toEmbed(
	type: string,
	id: string,
	compact: boolean,
	theme: SpotifyTheme,
): SpotifyEmbed | null {
	if (!isSpotifyType(type) || !id) return null
	return {
		type: type.toLowerCase() as SpotifyType,
		id,
		compact,
		theme,
	}
}

function inferCompact(source: string) {
	return /height=["']?152\b/i.test(source)
}

function inferTheme(source: string): SpotifyTheme {
	if (/[?&]theme=0(?:&|$)/i.test(source)) return 'dark'
	if (/\/embed\//i.test(source)) return 'color'
	return 'dark'
}

export function parseSpotifyRef(
	raw: string,
	options?: { compact?: boolean; theme?: SpotifyTheme },
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

export function spotifyEmbedSrc(embed: SpotifyEmbed) {
	const params = new URLSearchParams({ utm_source: 'generator' })
	if (embed.theme === 'dark') params.set('theme', '0')
	return `https://open.spotify.com/embed/${embed.type}/${embed.id}?${params}`
}

export function spotifyEmbedHeight(embed: SpotifyEmbed) {
	return embed.compact ? 152 : 352
}
