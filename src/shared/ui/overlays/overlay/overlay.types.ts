import type { ReactNode } from 'react'

export type OverlayId = string

export type OverlayOpenOptions = {
	/** Backdrop click + Escape. Default `true`. */
	dismissible?: boolean
}

export type OverlayEntry = {
	id: OverlayId
	content: ReactNode
	dismissible: boolean
}

export type OverlayContextValue = {
	open: (content: ReactNode, options?: OverlayOpenOptions) => OverlayId
	close: (id?: OverlayId) => void
	closeAll: () => void
}
