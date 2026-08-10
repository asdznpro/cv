import type { ReactNode } from 'react'

export type OverlayId = string

export type OverlayOpenOptions = {
	dismissible?: boolean
	className?: string
}

export type OverlayEntry = {
	id: OverlayId
	content: ReactNode
	dismissible: boolean
	className?: string
}

export type OverlayContextValue = {
	open: (content: ReactNode, options?: OverlayOpenOptions) => OverlayId
	close: (id?: OverlayId) => void
	closeAll: () => void
}
