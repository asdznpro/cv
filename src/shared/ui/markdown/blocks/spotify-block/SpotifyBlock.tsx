import { Spotify, type SpotifyProps } from 'ui/blocks'

export function SpotifyBlock(props: SpotifyProps) {
	return (
		<div className='not-prose my-6!'>
			<Spotify {...props} />
		</div>
	)
}
