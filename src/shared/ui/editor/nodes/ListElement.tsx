'use client'

import { Children } from 'react'
import type { TTodoListItemElement } from '@platejs/list-classic'
import {
	useTodoListElement,
	useTodoListElementState,
} from '@platejs/list-classic/react'
import type { PlateElementProps } from 'platejs/react'
import { PlateElement, useReadOnly } from 'platejs/react'
import { twMerge } from 'tailwind-merge'

import { Checkbox } from 'ui/forms'

import { typographyClassName } from '../typography'

export function UlElement(props: PlateElementProps) {
	return (
		<PlateElement
			as='ul'
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
			as='ol'
			className={twMerge(typographyClassName.ol, '[&_p]:my-0')}
			{...props}
		>
			{props.children}
		</PlateElement>
	)
}

export function TaskListElement(props: PlateElementProps) {
	return (
		<PlateElement
			as='ul'
			className={twMerge(typographyClassName.ul, 'list-none pl-0 [&_p]:my-0')}
			{...props}
		>
			{props.children}
		</PlateElement>
	)
}

export function LiElement(props: PlateElementProps) {
	if ('checked' in props.element) {
		return <TaskListItemElement {...props} />
	}

	return (
		<PlateElement as='li' className={typographyClassName.li} {...props}>
			{props.children}
		</PlateElement>
	)
}

function TaskListItemElement(props: PlateElementProps) {
	const readOnly = useReadOnly()
	const state = useTodoListElementState({
		element: props.element as TTodoListItemElement,
	})
	const { checkboxProps } = useTodoListElement(state)
	const [firstChild, ...otherChildren] = Children.toArray(props.children)

	return (
		<PlateElement
			as='li'
			className={twMerge(typographyClassName.li, 'flex flex-col gap-2')}
			{...props}
		>
			<div className='flex gap-2'>
				<span contentEditable={false} className='flex pt-0.5 shrink-0'>
					<Checkbox
						checked={checkboxProps.checked}
						disabled={readOnly}
						aria-label='Toggle task'
						onMouseDown={event => event.preventDefault()}
						onChange={event =>
							checkboxProps.onCheckedChange(event.currentTarget.checked)
						}
					/>
				</span>

				<div
					className={twMerge(
						'min-w-0 flex-1',
						checkboxProps.checked && 'text-foreground-secondary line-through',
					)}
				>
					{firstChild}
				</div>
			</div>

			{otherChildren}
		</PlateElement>
	)
}
