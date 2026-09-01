import type { ExtraProps } from 'react-markdown'
import type { ComponentPropsWithoutRef } from 'react'
import type { Element as HastElement } from 'hast'

import { isSpotifyType } from 'ui/blocks'

import { SpotifyBlock } from './SpotifyBlock'

type DivProps = ComponentPropsWithoutRef<'div'> &
	ExtraProps & { node?: HastElement }

export function renderSpotifyBlock({ node }: DivProps) {
	if (!node?.properties?.dataSpotify) return null

	const type = String(node.properties.dataSpotifyType ?? '')
	const id = String(node.properties.dataSpotifyId ?? '')
	if (!isSpotifyType(type) || !id) return null

	return (
		<SpotifyBlock
			type={type}
			id={id}
			compact={
				node.properties.dataSpotifyCompact === true ||
				node.properties.dataSpotifyCompact === 'true'
			}
			theme={node.properties.dataSpotifyTheme === 'color' ? 'color' : 'dark'}
		/>
	)
}
