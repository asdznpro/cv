import {
	parseSpotifyRef,
	type SpotifyEmbed,
	type SpotifyTheme,
} from 'ui/blocks'

const FLAG_RE = /^(compact|standard|color|dark)$/i

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
	let theme: SpotifyTheme | undefined

	while (index < tokens.length && FLAG_RE.test(tokens[index])) {
		const flag = tokens[index].toLowerCase()
		if (flag === 'compact') compact = true
		if (flag === 'standard') compact = false
		if (flag === 'color' || flag === 'dark') theme = flag
		index += 1
	}

	return parseSpotifyRef(tokens.slice(index).join(' '), { compact, theme })
}
