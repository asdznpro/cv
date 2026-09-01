import { twMerge } from 'tailwind-merge'

import type { SpotifyProps, SpotifyType } from './Spotify.interface'
import { spotifyEmbedHeight, spotifyEmbedSrc } from './spotify.util'

const TYPE_LABEL: Record<SpotifyType, string> = {
	playlist: 'playlist',
	album: 'album',
	track: 'track',
	episode: 'episode',
	show: 'show',
	artist: 'artist',
}

export function Spotify({
	type,
	id,
	compact = false,
	theme = 'dark',
	className,
}: SpotifyProps) {
	const embed = { type, id, compact, theme }

	return (
		<iframe
			src={spotifyEmbedSrc(embed)}
			title={`Spotify ${TYPE_LABEL[type]}`}
			width='100%'
			height={spotifyEmbedHeight(embed)}
			allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
			allowFullScreen
			loading='lazy'
			className={twMerge(
				'root block w-full border-0 scheme-dark rounded-3xl bg-background overflow-hidden',
				className,
			)}
		/>
	)
}
