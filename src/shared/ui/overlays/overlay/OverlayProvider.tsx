'use client'

import { createContext, use, useRef, useState, type ReactNode } from 'react'
import { useHotkeys, useLockScroll } from '@siberiacancode/reactuse'

import { OverlayPortal } from './OverlayPortal'
import type {
	OverlayContextValue,
	OverlayEntry,
	OverlayId,
	OverlayOpenOptions,
} from './overlay.types'

const OverlayContext = createContext<OverlayContextValue | null>(null)

export function useOverlay() {
	const ctx = use(OverlayContext)
	if (!ctx) throw new Error('OverlayProvider required')
	return ctx
}

export function OverlayProvider({ children }: { children: ReactNode }) {
	const [stack, setStack] = useState<OverlayEntry[]>([])
	const stackRef = useRef(stack)
	stackRef.current = stack

	const open = (
		content: ReactNode,
		options?: OverlayOpenOptions,
	): OverlayId => {
		const id = crypto.randomUUID()
		setStack(prev => [
			...prev,
			{
				id,
				content,
				dismissible: options?.dismissible ?? true,
				className: options?.className,
			},
		])
		return id
	}

	const close = (id?: OverlayId) => {
		setStack(prev => {
			if (prev.length === 0) return prev
			if (id == null) return prev.slice(0, -1)
			return prev.filter(entry => entry.id !== id)
		})
	}

	const closeAll = () => setStack([])

	useLockScroll({ enabled: stack.length > 0 })
	useHotkeys(
		'escape',
		() => {
			const current = stackRef.current.at(-1)
			if (current?.dismissible) close()
		},
		{ enabled: stack.length > 0 },
	)

	return (
		<OverlayContext value={{ open, close, closeAll }}>
			{children}

			<OverlayPortal
				stack={stack}
				onDismiss={() => {
					if (stackRef.current.at(-1)?.dismissible) close()
				}}
			/>
		</OverlayContext>
	)
}
