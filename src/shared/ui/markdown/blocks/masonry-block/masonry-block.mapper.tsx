import type { ExtraProps } from 'react-markdown'
import type { ComponentPropsWithoutRef } from 'react'
import type { Element as HastElement } from 'hast'

import { MasonryBlock } from './MasonryBlock'

type DivProps = ComponentPropsWithoutRef<'div'> &
	ExtraProps & { node?: HastElement }

export function renderMasonryBlock({ node, children, ...props }: DivProps) {
	if (!node?.properties?.dataMasonry) return null

	const columns = Number(node.properties.dataColumns ?? 2) === 3 ? 3 : 2

	return <MasonryBlock columns={columns}>{children}</MasonryBlock>
}
