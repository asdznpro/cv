'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import {
	FloatingPortal,
	arrow,
	autoUpdate,
	flip,
	offset,
	safePolygon,
	shift,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
	useTransitionStyles,
} from '@floating-ui/react'
import { twMerge } from 'tailwind-merge'

import { Arrow, ARROW_OFFSET } from '../arrow'
import { resolveFloatingPlacement } from '../lib'
import { useContextCardGroup } from './ContextCardGroup'
import {
	CONTEXT_CARD_ARROW_FILL,
	contextCardVariants,
} from './context-card.variants'
import type ContextCardProps from './ContextCard.interface'

const ARROW_GAP = 4
const DEFAULT_OPEN_DELAY = 150

function resolveOpenDelay(delay: ContextCardProps['delay']): number {
	if (delay === false) return 0
	if (typeof delay === 'number') return delay
	return DEFAULT_OPEN_DELAY
}

export function ContextCard(props: ContextCardProps) {
	const group = useContextCardGroup()

	if (group) {
		return <ContextCardTrigger {...props} />
	}

	return <ContextCardStandalone {...props} />
}

function ContextCardTrigger(props: ContextCardProps) {
	const {
		children,
		content,
		placement = 'top',
		align = 'center',
		tip = true,
		className,
	} = props

	const group = useContextCardGroup()
	const id = useId()
	const referenceRef = useRef<HTMLSpanElement | null>(null)

	if (!group) return null

	const payload = {
		content,
		placement,
		align,
		tip,
		className,
	}

	return (
		<span
			ref={referenceRef}
			className='max-w-full inline-flex align-middle'
			onMouseEnter={() => {
				const el = referenceRef.current
				if (el) group.activate(id, payload, el)
			}}
			onMouseLeave={() => group.deactivate(id)}
			onFocusCapture={() => {
				const el = referenceRef.current
				if (el) group.activate(id, payload, el)
			}}
			onBlurCapture={event => {
				const next = event.relatedTarget
				if (next instanceof Node && event.currentTarget.contains(next)) return
				group.deactivate(id)
			}}
		>
			{children as ReactNode}
		</span>
	)
}

function ContextCardStandalone(props: ContextCardProps) {
	const {
		children,
		content,
		placement = 'top',
		align = 'center',
		delay,
		tip = true,
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
			...(tip ? [arrow({ element: arrowRef, padding: 8 })] : []),
		],
	})

	const hover = useHover(context, {
		delay: { open: resolveOpenDelay(delay), close: 120 },
		handleClose: safePolygon({ buffer: 1 }),
	})
	const focus = useFocus(context, { visibleOnly: true })
	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'dialog' })

	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
		dismiss,
		role,
	])

	const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
		duration: { open: 140, close: 100 },
		initial: {
			opacity: 0,
			transform: 'scale(0.92)',
		},
	})

	const referenceProps = getReferenceProps({
		onFocusCapture: () => setIsOpen(true),
		onBlurCapture: (event: React.FocusEvent<HTMLSpanElement>) => {
			const next = event.relatedTarget
			if (next instanceof Node && event.currentTarget.contains(next)) return
			if (event.currentTarget.matches(':hover')) return
			setIsOpen(false)
		},
	})

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
							className={twMerge(contextCardVariants(), className)}
						>
							<div className='flex flex-col p-3 gap-3'>{content}</div>

							{tip && (
								<Arrow
									ref={arrowRef}
									context={context}
									mode='outline'
									fill={CONTEXT_CARD_ARROW_FILL}
									stroke='var(--separator)'
								/>
							)}
						</div>
					</div>
				</FloatingPortal>
			)}
		</>
	)
}
