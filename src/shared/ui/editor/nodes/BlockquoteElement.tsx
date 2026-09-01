'use client'

import type { PlateElementProps } from 'platejs/react'
import { PlateElement } from 'platejs/react'

import { typographyClassName } from '../typography'

export function BlockquoteElement(props: PlateElementProps) {
	return (
		<PlateElement
			as='blockquote'
			className={typographyClassName.blockquote}
			{...props}
		>
			{props.children}
		</PlateElement>
	)
}
