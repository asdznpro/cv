'use client'

import { createContext, use, useState } from 'react'
import { useHotkeys, useLockScroll } from '@siberiacancode/reactuse'

import type { PreviewCardProps } from 'ui/blocks'
import { ImageLightbox } from './ImageLightbox'

type Item = {
	id: string
	src: string
	alt?: string
	caption?: string
	variant?: 'framed' | 'plain'
	ratio?: PreviewCardProps['ratio']
}

const LightboxContext = createContext<{
	open: (item: Item) => void
	close: () => void
	active: Item | null
} | null>(null)

export function useLightbox() {
	const ctx = use(LightboxContext)
	if (!ctx) throw new Error('LightboxProvider required')
	return ctx
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
	const [active, setActive] = useState<Item | null>(null)
	const close = () => setActive(null)

	useLockScroll({ enabled: Boolean(active) })
	useHotkeys('escape', close, { enabled: Boolean(active) })

	return (
		<LightboxContext
			value={{ open: setActive, close: () => setActive(null), active }}
		>
			{children}
			<ImageLightbox />
		</LightboxContext>
	)
}
