import type { Element as HastElement } from 'hast'
import type { ExtraProps } from 'react-markdown'
import type { ComponentPropsWithoutRef } from 'react'

import type { PreviewCardProps } from 'ui/blocks'

import { getImageCaption, getNodeDataProperty } from '../../lib'
import { ImageBlock } from './ImageBlock'

type FigureProps = ComponentPropsWithoutRef<'figure'> &
	ExtraProps & {
		node?: HastElement
	}

export function renderImageFigure({ node, ...props }: FigureProps) {
	if (!('data-image-figure' in props || node?.properties?.dataImageFigure)) {
		return null
	}

	const img = node?.children?.find(
		(c): c is HastElement => c.type === 'element' && c.tagName === 'img',
	)

	return (
		<ImageBlock
			src={String(img?.properties?.src ?? '')}
			alt={String(img?.properties?.alt ?? '')}
			caption={getImageCaption(node)}
			variant={
				getNodeDataProperty(node?.properties, 'variant') === 'plain'
					? 'plain'
					: 'framed'
			}
			ratio={
				getNodeDataProperty(
					node?.properties,
					'ratio',
				) as PreviewCardProps['ratio']
			}
			masonry={Boolean(
				node?.properties?.dataMasonryItem || 'data-masonry-item' in props,
			)}
		/>
	)
}
