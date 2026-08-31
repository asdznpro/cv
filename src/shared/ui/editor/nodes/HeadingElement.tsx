'use client'

import type { PlateElementProps } from 'platejs/react'
import { PlateElement } from 'platejs/react'

import { typographyClassName } from '../typography'

export function H1Element(props: PlateElementProps) {
	return (
		<PlateElement as='h1' className={typographyClassName.h1} {...props}>
			{props.children}
		</PlateElement>
	)
}

export function H2Element(props: PlateElementProps) {
	return (
		<PlateElement as='h2' className={typographyClassName.h2} {...props}>
			{props.children}
		</PlateElement>
	)
}

export function H3Element(props: PlateElementProps) {
	return (
		<PlateElement as='h3' className={typographyClassName.h3} {...props}>
			{props.children}
		</PlateElement>
	)
}
