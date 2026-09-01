'use client'

import type { PlateElementProps } from 'platejs/react'
import { PlateElement } from 'platejs/react'

import { typographyClassName } from '../typography'

export function HrElement(props: PlateElementProps) {
	return (
		<PlateElement as='div' {...props}>
			<hr className={typographyClassName.hr} />
			{props.children}
		</PlateElement>
	)
}
