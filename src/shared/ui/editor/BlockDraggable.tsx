'use client'

import { useDraggable, useDropLine } from '@platejs/dnd'
import { KEYS } from 'platejs'
import type { PlateElementProps, RenderNodeWrapper } from 'platejs/react'
import { twMerge } from 'tailwind-merge'

import { Button } from 'ui/blocks'
import { Tooltip } from 'ui/floating'

import { Icon24DotsVertical } from '@vkontakte/icons'

const HEADING_KEYS = new Set<string>([KEYS.h1, KEYS.h2, KEYS.h3])

export const BlockDraggable: RenderNodeWrapper = ({ editor, path }) => {
	if (editor.dom.readOnly || path.length !== 1) return

	return props => <Draggable {...props} />
}

function Draggable({ children, element, path }: PlateElementProps) {
	const { handleRef, isDragging, nodeRef } = useDraggable({
		element,
		preview: { disable: true },
	})
	const isHeading = HEADING_KEYS.has(element.type)
	const isFirst = path[0] === 0

	return (
		<div
			className={twMerge(
				'group/block relative',
				isHeading && !isFirst && 'mt-12',
				isDragging && 'opacity-50',
			)}
		>
			<div
				contentEditable={false}
				className={twMerge(
					'absolute top-0 -left-8 z-10 flex w-7 h-7 items-center justify-center',
					'opacity-0 transition-opacity group-hover/block:opacity-100',
					isDragging && 'opacity-100',
				)}
			>
				<Tooltip text='Drag to move' placement='left' tip={false}>
					<Button
						ref={handleRef}
						aria-label='Drag to move'
						data-plate-prevent-deselect
						className='cursor-grab active:cursor-grabbing active:scale-100'
						type='button'
						size='sm'
						mode='ghost'
						appearance='neutral'
						prefix={<Icon24DotsVertical width={16} height={16} />}
						radius='rounded'
						iconOnly
					/>
				</Tooltip>
			</div>

			<div ref={nodeRef}>{children}</div>

			<DropLine id={String(element.id ?? '')} />
		</div>
	)
}

function DropLine({ id }: { id: string }) {
	const { dropLine } = useDropLine({ id })

	if (!dropLine) return null

	return (
		<div
			contentEditable={false}
			className={twMerge(
				'pointer-events-none absolute inset-x-0 z-20 h-0.5 rounded-full bg-accent',
				dropLine === 'top' && '-top-px',
				dropLine === 'bottom' && '-bottom-px',
			)}
		/>
	)
}
