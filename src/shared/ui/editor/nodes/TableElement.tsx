'use client'

import type { PlateElementProps } from 'platejs/react'
import { PlateElement } from 'platejs/react'
import { twMerge } from 'tailwind-merge'

import { typographyClassName } from '../typography'

export function TableElement(props: PlateElementProps) {
	return (
		<PlateElement className={typographyClassName.tableWrap} {...props}>
			<table className={typographyClassName.table}>
				<tbody>{props.children}</tbody>
			</table>
		</PlateElement>
	)
}

export function TableRowElement(props: PlateElementProps) {
	return (
		<PlateElement as='tr' className={typographyClassName.tr} {...props}>
			{props.children}
		</PlateElement>
	)
}

export function TableCellElement(props: PlateElementProps) {
	return (
		<PlateElement
			as='td'
			className={twMerge(typographyClassName.td, '[&_p]:my-0')}
			{...props}
		>
			{props.children}
		</PlateElement>
	)
}

export function TableCellHeaderElement(props: PlateElementProps) {
	return (
		<PlateElement
			as='th'
			className={twMerge(typographyClassName.th, '[&_p]:my-0')}
			{...props}
		>
			{props.children}
		</PlateElement>
	)
}
