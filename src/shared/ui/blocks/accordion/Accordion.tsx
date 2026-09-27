'use client'

import {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react'

import { AnimatePresence, motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'

import type {
	AccordionContentProps,
	AccordionItemProps,
	AccordionRootProps,
	AccordionTriggerProps,
} from './Accordion.interface'

type FocusDirection = 1 | -1 | 'first' | 'last'

type AccordionContextValue = {
	disabled: boolean
	isOpen: (value: string) => boolean
	toggle: (value: string) => void
	registerTrigger: (value: string, node: HTMLButtonElement | null) => void
	focusTrigger: (current: HTMLButtonElement, direction: FocusDirection) => void
}

type AccordionItemContextValue = {
	value: string
	open: boolean
	disabled: boolean
	triggerId: string
	panelId: string
	panelMounted: boolean
	setPanelMounted: (mounted: boolean) => void
	toggle: () => void
	registerTrigger: (value: string, node: HTMLButtonElement | null) => void
	focusTrigger: (current: HTMLButtonElement, direction: FocusDirection) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)
const AccordionItemContext = createContext<AccordionItemContextValue | null>(
	null,
)

function useAccordion() {
	const context = useContext(AccordionContext)

	if (!context) {
		throw new Error(
			'Accordion components must be rendered inside Accordion.Root',
		)
	}

	return context
}

function useAccordionItem() {
	const context = useContext(AccordionItemContext)

	if (!context) {
		throw new Error(
			'Accordion.Trigger and Accordion.Content must be rendered inside Accordion.Item',
		)
	}

	return context
}

function toValues(value: string | string[] | null | undefined) {
	if (value == null || value === '') return []
	return Array.isArray(value) ? value : [value]
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
	if (typeof ref === 'function') {
		ref(node)
		return
	}

	if (ref) {
		ref.current = node
	}
}

function AccordionRoot(props: AccordionRootProps) {
	const type = props.type ?? 'single'
	const collapsible =
		props.type === 'multiple' ? true : (props.collapsible ?? true)
	const disabled = props.disabled ?? false
	const isControlled = props.value !== undefined

	const onValueChangeRef = useRef(props.onValueChange)
	onValueChangeRef.current = props.onValueChange

	const [uncontrolled, setUncontrolled] = useState(() =>
		toValues(props.defaultValue),
	)
	const openValues = isControlled ? toValues(props.value) : uncontrolled
	const openValuesRef = useRef(openValues)
	openValuesRef.current = openValues

	const triggersRef = useRef(new Map<string, HTMLButtonElement>())

	const commit = useCallback(
		(next: string[]) => {
			if (!isControlled) setUncontrolled(next)

			const onValueChange = onValueChangeRef.current
			if (!onValueChange) return

			if (type === 'multiple') {
				;(onValueChange as (value: string[]) => void)(next)
				return
			}

			;(onValueChange as (value: string | null) => void)(next[0] ?? null)
		},
		[isControlled, type],
	)

	const toggle = useCallback(
		(value: string) => {
			if (disabled) return

			const current = openValuesRef.current
			const isOpen = current.includes(value)

			if (type === 'single') {
				if (isOpen) {
					if (collapsible) commit([])
					return
				}

				commit([value])
				return
			}

			commit(
				isOpen ? current.filter(item => item !== value) : [...current, value],
			)
		},
		[collapsible, commit, disabled, type],
	)

	const isOpen = useCallback(
		(value: string) => openValues.includes(value),
		[openValues],
	)

	const registerTrigger = useCallback(
		(value: string, node: HTMLButtonElement | null) => {
			if (node) {
				triggersRef.current.set(value, node)
				return
			}

			triggersRef.current.delete(value)
		},
		[],
	)

	const focusTrigger = useCallback(
		(current: HTMLButtonElement, direction: FocusDirection) => {
			const nodes = [...triggersRef.current.values()].filter(
				node => node.isConnected && !node.disabled,
			)

			nodes.sort((left, right) => {
				if (left === right) return 0

				const position = left.compareDocumentPosition(right)

				if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
				if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1

				return 0
			})

			if (nodes.length === 0) return

			const index = nodes.indexOf(current)
			let nextIndex = 0

			if (direction === 'first') nextIndex = 0
			else if (direction === 'last') nextIndex = nodes.length - 1
			else {
				const start = index === -1 ? 0 : index
				nextIndex = (start + direction + nodes.length) % nodes.length
			}

			nodes[nextIndex]?.focus()
		},
		[],
	)

	const context = useMemo<AccordionContextValue>(
		() => ({
			disabled,
			isOpen,
			toggle,
			registerTrigger,
			focusTrigger,
		}),
		[disabled, focusTrigger, isOpen, registerTrigger, toggle],
	)

	return (
		<AccordionContext.Provider value={context}>
			{props.children}
		</AccordionContext.Provider>
	)
}

function AccordionItem({
	value,
	disabled = false,
	children,
}: AccordionItemProps) {
	const accordion = useAccordion()
	const reactId = useId()
	const [panelMounted, setPanelMounted] = useState(false)

	const open = accordion.isOpen(value)
	const itemDisabled = disabled || accordion.disabled

	const toggle = useCallback(() => {
		if (itemDisabled) return
		accordion.toggle(value)
	}, [accordion, itemDisabled, value])

	const context = useMemo<AccordionItemContextValue>(
		() => ({
			value,
			open,
			disabled: itemDisabled,
			triggerId: `${reactId}-trigger`,
			panelId: `${reactId}-panel`,
			panelMounted,
			setPanelMounted,
			toggle,
			registerTrigger: accordion.registerTrigger,
			focusTrigger: accordion.focusTrigger,
		}),
		[
			accordion.focusTrigger,
			accordion.registerTrigger,
			itemDisabled,
			open,
			panelMounted,
			reactId,
			toggle,
			value,
		],
	)

	return (
		<AccordionItemContext.Provider value={context}>
			{children}
		</AccordionItemContext.Provider>
	)
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
	function AccordionTrigger(
		{ className, disabled, onClick, onKeyDown, ...props },
		forwardedRef,
	) {
		const item = useAccordionItem()
		const isDisabled = Boolean(disabled || item.disabled)

		const setRef = useCallback(
			(node: HTMLButtonElement | null) => {
				item.registerTrigger(item.value, node)
				assignRef(forwardedRef, node)
			},
			[forwardedRef, item.registerTrigger, item.value],
		)

		return (
			<button
				{...props}
				ref={setRef}
				type='button'
				id={item.triggerId}
				className={className}
				disabled={isDisabled}
				aria-expanded={item.open}
				aria-controls={item.panelMounted ? item.panelId : undefined}
				data-state={item.open ? 'open' : 'closed'}
				data-disabled={isDisabled ? '' : undefined}
				onClick={event => {
					onClick?.(event)
					if (event.defaultPrevented || isDisabled) return
					item.toggle()
				}}
				onKeyDown={event => {
					onKeyDown?.(event)
					if (event.defaultPrevented || isDisabled) return

					if (event.key === 'ArrowDown') {
						event.preventDefault()
						item.focusTrigger(event.currentTarget, 1)
					} else if (event.key === 'ArrowUp') {
						event.preventDefault()
						item.focusTrigger(event.currentTarget, -1)
					} else if (event.key === 'Home') {
						event.preventDefault()
						item.focusTrigger(event.currentTarget, 'first')
					} else if (event.key === 'End') {
						event.preventDefault()
						item.focusTrigger(event.currentTarget, 'last')
					}
				}}
			/>
		)
	},
)

const CONTENT_TRANSITION = {
	height: {
		type: 'tween' as const,
		duration: 0.16,
		ease: 'easeInOut' as const,
	},
	opacity: { duration: 0.16 },
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
	function AccordionContent({ className, children, ...props }, forwardedRef) {
		const item = useAccordionItem()

		const setRef = useCallback(
			(node: HTMLDivElement | null) => {
				assignRef(forwardedRef, node)
				item.setPanelMounted(node !== null)
			},
			[forwardedRef, item.setPanelMounted],
		)

		return (
			<AnimatePresence initial={false}>
				{item.open && (
					<motion.div
						{...props}
						ref={setRef}
						key={item.panelId}
						id={item.panelId}
						role='region'
						aria-labelledby={item.triggerId}
						data-state='open'
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={CONTENT_TRANSITION}
						className={twMerge('overflow-hidden', className)}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		)
	},
)

AccordionRoot.displayName = 'Accordion.Root'
AccordionItem.displayName = 'Accordion.Item'
AccordionTrigger.displayName = 'Accordion.Trigger'
AccordionContent.displayName = 'Accordion.Content'

export const Accordion = {
	Root: AccordionRoot,
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Content: AccordionContent,
}
