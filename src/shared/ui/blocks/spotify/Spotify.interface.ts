export const SPOTIFY_TYPES = [
	'playlist',
	'album',
	'track',
	'episode',
	'show',
	'artist',
] as const

export type SpotifyType = (typeof SPOTIFY_TYPES)[number]
export type SpotifyTheme = 'dark' | 'color'

export type SpotifyEmbed = {
	type: SpotifyType
	id: string
	compact: boolean
	theme: SpotifyTheme
}

export interface SpotifyProps {
	type: SpotifyType
	id: string
	compact?: boolean
	theme?: SpotifyTheme
	className?: string
}
