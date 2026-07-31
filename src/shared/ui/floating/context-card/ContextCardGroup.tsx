'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	FloatingPortal,
	arrow,
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'

import { Arrow, ARROW_OFFSET } from '../arrow'
import { resolveFloatingPlacement } from '../lib'
import {
	CONTEXT_CARD_ARROW_FILL,
	contextCardVariants,
} from './context-card.variants'
import type {
	ContextCardActivePayload,
	ContextCardGroupProps,
} from './ContextCard.interface'

const ARROW_GAP = 4

const SPRING = {
	type: 'spring' as const,
	stiffness: 420,
	damping: 34,
	mass: 0.7,
}

type ActiveState = ContextCardActivePayload & {
	id: string
}

type ContextCardGroupValue = {
	activate: (
		id: string,
		payload: ContextCardActivePayload,
		reference: Element,
	) => void
	deactivate: (id: string) => void
	cancelDeactivate: () => void
	activeId: string | null
}

const ContextCardGroupContext = createContext<ContextCardGroupValue | null>(
	null,
)

export function useContextCardGroup() {
	return useContext(ContextCardGroupContext)
}

function ContextCardHost({
	active,
	open,
	reference,
	referenceVersion,
	onOpenChange,
	onFloatingEnter,
	onFloatingLeave,
}: {
	active: ActiveState | null
	open: boolean
	reference: Element | null
	referenceVersion: number
	onOpenChange: (open: boolean) => void
	onFloatingEnter: () => void
	onFloatingLeave: () => void
}) {
	const arrowRef = useRef<SVGSVGElement | null>(null)
	const tip = active?.tip ?? true

	const { refs, context, x, y, strategy, placement, isPositioned } =
		useFloating({
			open,
			onOpenChange,
			strategy: 'fixed',
			// top/left instead of transform — required for motion `layout` size morph
			transform: false,
			placement: resolveFloatingPlacement(
				active?.placement ?? 'top',
				active?.align ?? 'center',
			),
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

	useEffect(() => {
		refs.setReference(reference)
	}, [reference, referenceVersion, refs])

	// Skip position spring until the first correct coords are applied
	const [canSpring, setCanSpring] = useState(false)

	useEffect(() => {
		if (!open) {
			setCanSpring(false)
			return
		}
		if (!isPositioned) return

		const id = requestAnimationFrame(() => setCanSpring(true))
		return () => cancelAnimationFrame(id)
	}, [open, isPositioned])

	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'dialog' })
	const { getFloatingProps } = useInteractions([dismiss, role])

	const positionTransition = canSpring ? SPRING : { duration: 0 }

	return (
		<FloatingPortal>
			<AnimatePresence>
				{open && active && (
					<motion.div
						ref={refs.setFloating}
						key='context-card-host'
						data-placement={placement}
						initial={false}
						animate={{
							opacity: isPositioned ? 1 : 0,
							top: y ?? 0,
							left: x ?? 0,
						}}
						exit={{ opacity: 0 }}
						transition={{
							top: positionTransition,
							left: positionTransition,
							opacity: { duration: 0.12, ease: 'easeOut' },
						}}
						style={{ position: strategy }}
						{...getFloatingProps({
							onMouseEnter: onFloatingEnter,
							onMouseLeave: onFloatingLeave,
						})}
					>
						<motion.div
							layout
							transition={{ layout: SPRING }}
							className={twMerge(
								contextCardVariants(),
								'relative',
								active.className,
							)}
						>
							<div className='overflow-hidden'>
								<AnimatePresence mode='popLayout' initial={false}>
									<motion.div
										key={active.id}
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											layout: SPRING,
											opacity: { duration: 0.14, ease: 'easeOut' },
										}}
										className='flex flex-col p-3 gap-3'
									>
										{active.content}
									</motion.div>
								</AnimatePresence>
							</div>

							{tip && (
								<Arrow
									ref={arrowRef}
									context={context}
									mode='outline'
									fill={CONTEXT_CARD_ARROW_FILL}
									stroke='var(--separator)'
								/>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</FloatingPortal>
	)
}

export function ContextCardGroup(props: ContextCardGroupProps) {
	const { children, delay = 150, closeDelay = 180 } = props

	const [active, setActive] = useState<ActiveState | null>(null)
	const [open, setOpen] = useState(false)
	const [referenceVersion, setReferenceVersion] = useState(0)

	const referenceRef = useRef<Element | null>(null)
	const openTimerRef = useRef<number | null>(null)
	const closeTimerRef = useRef<number | null>(null)
	const instantUntilRef = useRef(0)
	const activeIdRef = useRef<string | null>(null)
	const openRef = useRef(false)

	const clearOpenTimer = () => {
		if (openTimerRef.current != null) {
			window.clearTimeout(openTimerRef.current)
			openTimerRef.current = null
		}
	}

	const clearCloseTimer = () => {
		if (closeTimerRef.current != null) {
			window.clearTimeout(closeTimerRef.current)
			closeTimerRef.current = null
		}
	}

	const cancelDeactivate = useCallback(() => {
		clearCloseTimer()
	}, [])

	const activate = useCallback(
		(id: string, payload: ContextCardActivePayload, reference: Element) => {
			clearCloseTimer()
			clearOpenTimer()

			referenceRef.current = reference
			activeIdRef.current = id

			const commit = () => {
				setActive({ id, ...payload })
				setOpen(true)
				openRef.current = true
				setReferenceVersion(v => v + 1)
				instantUntilRef.current = Date.now() + closeDelay + 400
			}

			if (openRef.current || Date.now() < instantUntilRef.current) {
				commit()
				return
			}

			if (delay <= 0) {
				commit()
				return
			}

			openTimerRef.current = window.setTimeout(commit, delay)
		},
		[closeDelay, delay],
	)

	const deactivate = useCallback(
		(id: string) => {
			clearOpenTimer()
			if (activeIdRef.current && activeIdRef.current !== id) return

			clearCloseTimer()
			closeTimerRef.current = window.setTimeout(() => {
				setOpen(false)
				openRef.current = false
				activeIdRef.current = null
				setActive(null)
				referenceRef.current = null
			}, closeDelay)
		},
		[closeDelay],
	)

	const onOpenChange = useCallback((next: boolean) => {
		if (next) return
		clearOpenTimer()
		clearCloseTimer()
		setOpen(false)
		openRef.current = false
		activeIdRef.current = null
		setActive(null)
		referenceRef.current = null
	}, [])

	const value = useMemo<ContextCardGroupValue>(
		() => ({
			activate,
			deactivate,
			cancelDeactivate,
			activeId: active?.id ?? null,
		}),
		[activate, deactivate, cancelDeactivate, active?.id],
	)

	return (
		<ContextCardGroupContext.Provider value={value}>
			{children}
			<ContextCardHost
				active={active}
				open={open}
				reference={referenceRef.current}
				referenceVersion={referenceVersion}
				onOpenChange={onOpenChange}
				onFloatingEnter={cancelDeactivate}
				onFloatingLeave={() => {
					if (activeIdRef.current) deactivate(activeIdRef.current)
				}}
			/>
		</ContextCardGroupContext.Provider>
	)
}
