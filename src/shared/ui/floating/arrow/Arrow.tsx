'use client'

import { forwardRef } from 'react'
import type { FloatingContext } from '@floating-ui/react'

/** Square SVG box (viewBox / layout) */
export const ARROW_SIZE = 16

/**
 * How far the caret tip sticks out past the floating edge.
 * Used by `offset()` — not the SVG box size (half of the square is empty for rotation).
 */
export const ARROW_OFFSET = 8

/** Tip UP, with stroke lip — for bordered surfaces (Context Card) */
const ARROW_PATH_OUTLINE =
	'M-2 16.5C-2 15.9477 -1.55228 15.5 -1 15.5L1.93792 15.5C3.00969 15.5 4.00005 14.9282 4.53596 14.0001L6.70117 10.25C7.27854 9.25012 8.72146 9.25012 9.29883 10.25L11.464 14.0001C11.9999 14.9282 12.9903 15.5 14.0621 15.5L17 15.5C17.5523 15.5 18 15.9477 18 16.5C18 17.0523 17.5523 17.5 17 17.5L-1 17.5C-1.55228 17.5 -2 17.0523 -2 16.5Z'

/** Tip UP, fill only — for solid surfaces (Tooltip) */
const ARROW_PATH_PLAIN =
	'M18 17C18 16.4477 17.5523 16 17 16H14.5886C14.3584 16 14.2433 16 14.1358 15.9923C13.219 15.9263 12.383 15.4437 11.8674 14.6827C11.807 14.5935 11.7494 14.4938 11.6343 14.2945L10.0781 11.5996C9.39636 10.4188 9.0554 9.82822 8.61035 9.62988C8.22199 9.45697 7.77801 9.45697 7.38965 9.62988C6.9446 9.82822 6.60364 10.4188 5.92188 11.5996L4.3657 14.2945C4.25059 14.4938 4.19304 14.5935 4.1326 14.6827C3.61702 15.4437 2.78102 15.9263 1.86419 15.9923C1.75671 16 1.64162 16 1.41144 16H-1C-1.55228 16 -2 16.4477 -2 17C-2 17.5523 -1.55228 18 -1 18H17C17.5523 18 18 17.5523 18 17Z'

const OVERLAP = 0

export type ArrowMode = 'outline' | 'plain'

export type ArrowProps = {
	context: FloatingContext
	/** `outline` — stroke lip; `plain` — fill only */
	mode?: ArrowMode
	fill?: string
	stroke?: string
	strokeWidth?: number
	overlap?: number
	className?: string
}

export const Arrow = forwardRef<SVGSVGElement, ArrowProps>(
	function Arrow(props, ref) {
		const {
			context,
			mode = 'outline',
			fill = 'var(--background)',
			stroke = 'var(--separator)',
			strokeWidth = 1,
			overlap = OVERLAP,
			className,
		} = props

		const { placement, middlewareData } = context
		const side = placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left'
		const arrowData = middlewareData.arrow
		const isVertical = side === 'top' || side === 'bottom'
		const outlined = mode === 'outline'

		const rotation = {
			top: 'rotate(180deg)',
			right: 'rotate(-90deg)',
			bottom: 'rotate(0deg)',
			left: 'rotate(90deg)',
		}[side]

		return (
			<svg
				ref={ref}
				aria-hidden
				width={ARROW_SIZE}
				height={ARROW_SIZE}
				viewBox={`0 0 ${ARROW_SIZE} ${ARROW_SIZE}`}
				fill='none'
				className={className}
				style={{
					position: 'absolute',
					pointerEvents: 'none',
					left: isVertical ? (arrowData?.x ?? undefined) : undefined,
					top: !isVertical ? (arrowData?.y ?? undefined) : undefined,
					[side]: `calc(100% - ${overlap}px)`,
					transform: rotation,
					transformOrigin: 'center',
				}}
			>
				<path
					d={outlined ? ARROW_PATH_OUTLINE : ARROW_PATH_PLAIN}
					fill={fill}
					stroke={outlined ? stroke : undefined}
					strokeWidth={outlined ? strokeWidth : undefined}
				/>
			</svg>
		)
	},
)
