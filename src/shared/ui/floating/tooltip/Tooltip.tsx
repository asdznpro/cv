'use client'

import { useRef, useState, type ReactNode } from 'react'
import {
	FloatingPortal,
	arrow,
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useHover,
	useInteractions,
	useRole,
	useTransitionStyles,
} from '@floating-ui/react'
import { twMerge } from 'tailwind-merge'

import { Arrow, ARROW_OFFSET } from '../arrow'
import { resolveFloatingPlacement } from '../lib'
import { tooltipArrowFill, tooltipVariants } from './tooltip.variants'
import type TooltipProps from './Tooltip.interface'

const ARROW_GAP = 4
const DEFAULT_OPEN_DELAY = 150

function resolveOpenDelay(delay: TooltipProps['delay']): number {
	if (delay === false) return 0
	if (typeof delay === 'number') return delay
	return DEFAULT_OPEN_DELAY
}

export function Tooltip(props: TooltipProps) {
	const {
		children,
		text,
		placement = 'top',
		delay = false,
		tip = true,
		appearance = 'neutral',
		align = 'center',
		className,
		open: openProp,
		defaultOpen = false,
		onOpenChange,
	} = props

	const arrowRef = useRef<SVGSVGElement | null>(null)
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)

	const isControlled = openProp !== undefined
	const isOpen = isControlled ? Boolean(openProp) : uncontrolledOpen

	const setIsOpen = (next: boolean) => {
		if (!isControlled) setUncontrolledOpen(next)
		onOpenChange?.(next)
	}

	const {
		refs,
		floatingStyles,
		context,
		placement: resolvedPlacement,
	} = useFloating({
		placement: resolveFloatingPlacement(placement, align),
		open: isOpen,
		onOpenChange: setIsOpen,
		strategy: 'fixed',
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(tip ? ARROW_OFFSET + ARROW_GAP : ARROW_GAP),
			flip({
				fallbackAxisSideDirection: 'start',
				padding: 8,
			}),
			shift({ padding: 8 }),
			...(tip ? [arrow({ element: arrowRef, padding: 6 })] : []),
		],
	})

	const hover = useHover(context, {
		move: false,
		delay: { open: resolveOpenDelay(delay), close: 0 },
	})
	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'tooltip' })

	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		dismiss,
		role,
	])

	const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
		duration: { open: 120, close: 100 },
		initial: {
			opacity: 0,
			transform: 'scale(0.92)',
		},
	})

	const referenceProps = getReferenceProps({
		onFocusCapture: () => {
			setIsOpen(true)
		},
		onBlurCapture: (event: React.FocusEvent<HTMLSpanElement>) => {
			const next = event.relatedTarget
			if (next instanceof Node && event.currentTarget.contains(next)) return
			if (event.currentTarget.matches(':hover')) return
			setIsOpen(false)
		},
	})

	const fill = tooltipArrowFill[appearance]

	return (
		<>
			<span
				ref={refs.setReference}
				className='max-w-full inline-flex align-middle'
				{...referenceProps}
			>
				{children as ReactNode}
			</span>

			{isMounted && (
				<FloatingPortal>
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						data-placement={resolvedPlacement}
						{...getFloatingProps()}
					>
						<div
							style={transitionStyles}
							className={twMerge(tooltipVariants({ appearance }), className)}
						>
							{text}

							{tip && (
								<Arrow
									ref={arrowRef}
									context={context}
									mode='plain'
									fill={fill}
								/>
							)}
						</div>
					</div>
				</FloatingPortal>
			)}
		</>
	)
}
