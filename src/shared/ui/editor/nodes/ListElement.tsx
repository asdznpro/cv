'use client'

import type { PlateElementProps } from 'platejs/react'
import { PlateElement } from 'platejs/react'
import { twMerge } from 'tailwind-merge'

import { typographyClassName } from '../typography'

export function UlElement(props: PlateElementProps) {
	return (
		<PlateElement
			as="ul"
			className={twMerge(
				typographyClassName.ul,
				'[&_p]:my-0 [&_ul]:list-[circle] [&_ul_ul]:list-[square]',
			)}
			{...props}
		>
			{props.children}
		</PlateElement>
	)
}

export function OlElement(props: PlateElementProps) {
	return (
		<PlateElement
			as="ol"
			className={twMerge(typographyClassName.ol, '[&_p]:my-0')}
			{...props}
		>
			{props.children}
		</PlateElement>
	)
}

export function LiElement(props: PlateElementProps) {
	return (
		<PlateElement as="li" className={typographyClassName.li} {...props}>
			{props.children}
		</PlateElement>
	)
}
