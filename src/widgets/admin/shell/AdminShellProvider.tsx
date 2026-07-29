'use client'

import {
	createContext,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
	useCallback,
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
} from 'react'

import {
	animate,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
	type MotionValue,
} from 'motion/react'
import { useLocalStorage } from '@siberiacancode/reactuse'

const MIN = 240
const MAX = 420
const DEFAULT = 280
const DIM_MAX = 1.2
const STORAGE_KEY = 'cv-admin-sidebar'

const WIDTH_TRANSITION = {
	duration: 0.28,
	ease: [0.32, 0.72, 0, 1] as const,
}

type SidebarStorage = {
	open: boolean
	width: number
}

type AdminShellContextValue = {
	ready: boolean
	open: boolean
	clipLayout: boolean
	widthMv: MotionValue<number>
	dimOpacity: MotionValue<number>
	toggle: () => void
	openSidebar: () => void
	closeSidebar: () => void
	onResizeStart: (e: ReactPointerEvent) => void
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null)

function clampWidth(width: number) {
	return Math.min(MAX, Math.max(MIN, width || DEFAULT))
}

function readSidebarStorage(): SidebarStorage {
	if (typeof window === 'undefined') {
		return { open: true, width: DEFAULT }
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) return { open: true, width: DEFAULT }

		const parsed = JSON.parse(raw) as Partial<SidebarStorage>
		return {
			open: parsed.open ?? true,
			width: clampWidth(parsed.width ?? DEFAULT),
		}
	} catch {
		return { open: true, width: DEFAULT }
	}
}

export function AdminShellProvider({ children }: { children: ReactNode }) {
	const { set: setStored } = useLocalStorage<SidebarStorage>(STORAGE_KEY, {
		open: true,
		width: DEFAULT,
	})

	const [ready, setReady] = useState(false)
	const [open, setOpen] = useState(true)
	const [clipLayout, setClipLayout] = useState(false)

	const dragging = useRef(false)
	const widthRef = useRef(DEFAULT)
	const closingRef = useRef(false)

	const widthMv = useMotionValue(DEFAULT)
	const dimOpacity = useTransform(widthMv, [0, MIN], [DIM_MAX, 0], {
		clamp: true,
	})

	useMotionValueEvent(widthMv, 'change', w => {
		setClipLayout(w < MIN)
	})

	const persist = useCallback(
		(next: SidebarStorage) => {
			setStored({
				open: next.open,
				width: clampWidth(next.width),
			})
		},
		[setStored],
	)

	// До первой отрисовки — без прыжка DEFAULT → stored
	useLayoutEffect(() => {
		const stored = readSidebarStorage()
		widthRef.current = stored.width

		if (stored.open) {
			widthMv.set(stored.width)
			setOpen(true)
			setClipLayout(false)
		} else {
			widthMv.set(0)
			setOpen(false)
			setClipLayout(true)
		}

		setReady(true)
	}, [widthMv])

	const stopWidthAnimation = () => {
		widthMv.stop()
	}

	const closeSidebar = useCallback(() => {
		if (closingRef.current || !open) return
		closingRef.current = true
		setClipLayout(true)
		stopWidthAnimation()

		animate(widthMv, 0, {
			...WIDTH_TRANSITION,
			onComplete: () => {
				setOpen(false)
				closingRef.current = false
				widthMv.set(0)
				persist({ open: false, width: widthRef.current || DEFAULT })
			},
		})
	}, [open, persist, widthMv])

	const openSidebar = useCallback(() => {
		closingRef.current = false
		stopWidthAnimation()
		const target = widthRef.current || DEFAULT
		widthMv.set(0)
		setClipLayout(true)
		setOpen(true)

		animate(widthMv, target, {
			...WIDTH_TRANSITION,
			onComplete: () => {
				setClipLayout(false)
				persist({ open: true, width: target })
			},
		})
	}, [persist, widthMv])

	const toggle = useCallback(() => {
		if (open) closeSidebar()
		else openSidebar()
	}, [open, closeSidebar, openSidebar])

	const onResizeStart = useCallback(
		(e: ReactPointerEvent) => {
			if (!open || closingRef.current) return

			e.preventDefault()
			dragging.current = true
			stopWidthAnimation()
			;(e.target as HTMLElement).setPointerCapture(e.pointerId)

			const previousUserSelect = document.body.style.userSelect
			const previousCursor = document.body.style.cursor
			document.body.style.userSelect = 'none'
			document.body.style.cursor = 'col-resize'

			const onMove = (ev: PointerEvent) => {
				if (!dragging.current) return

				const next = Math.max(0, Math.min(MAX, ev.clientX))
				widthMv.set(next)

				if (next >= MIN) {
					widthRef.current = next
				}
			}

			const onUp = () => {
				dragging.current = false
				document.body.style.userSelect = previousUserSelect
				document.body.style.cursor = previousCursor
				window.removeEventListener('pointermove', onMove)
				window.removeEventListener('pointerup', onUp)

				const current = widthMv.get()

				if (current < MIN) {
					closeSidebar()
					return
				}

				widthRef.current = current
				setClipLayout(false)
				persist({ open: true, width: current })
			}

			window.addEventListener('pointermove', onMove)
			window.addEventListener('pointerup', onUp)
		},
		[closeSidebar, open, persist, widthMv],
	)

	return (
		<AdminShellContext.Provider
			value={{
				ready,
				open,
				clipLayout,
				widthMv,
				dimOpacity,
				toggle,
				openSidebar,
				closeSidebar,
				onResizeStart,
			}}
		>
			<div
				className='flex h-full w-full flex-1'
				style={{ visibility: ready ? 'visible' : 'hidden' }}
			>
				{children}
			</div>
		</AdminShellContext.Provider>
	)
}

export function useAdminShell() {
	const ctx = useContext(AdminShellContext)
	if (!ctx) {
		throw new Error('useAdminShell must be used within AdminShellProvider')
	}
	return ctx
}

export { MIN }
