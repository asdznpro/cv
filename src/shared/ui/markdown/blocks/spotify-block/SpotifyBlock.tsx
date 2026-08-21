import {
	spotifyEmbedHeight,
	spotifyEmbedSrc,
	type SpotifyEmbed,
	type SpotifyEmbedType,
} from '../../lib/parse-spotify.util'

type SpotifyBlockProps = SpotifyEmbed

const TYPE_LABEL: Record<SpotifyEmbedType, string> = {
	playlist: 'playlist',
	album: 'album',
	track: 'track',
	episode: 'episode',
	show: 'show',
	artist: 'artist',
}

export function SpotifyBlock({ type, id, compact, theme }: SpotifyBlockProps) {
	const embed = { type, id, compact, theme }

	return (
		<div className='not-prose my-6! overflow-hidden rounded-3xl bg-background'>
			<iframe
				src={spotifyEmbedSrc(embed)}
				title={`Spotify ${TYPE_LABEL[type]}`}
				width='100%'
				height={spotifyEmbedHeight(embed)}
				allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
				allowFullScreen
				loading='lazy'
				className='block w-full border-0 scheme-dark'
			/>
		</div>
	)
}
