import type { Placement } from '@floating-ui/react'

import type { FloatingAlign } from '../lib'

export default interface ContextCardProps {
	children: React.ReactNode
	/** Richer than Tooltip — heading, metadata, one CTA */
	content: React.ReactNode
	placement?: Placement
	align?: FloatingAlign
	/**
	 * Open delay. In a `ContextCardGroup`, group delay wins after first open.
	 * `true` / omitted → 150ms. `false` → immediate.
	 */
	delay?: boolean | number
	tip?: boolean
	className?: string
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
}

export interface ContextCardGroupProps {
	children: React.ReactNode
	/** Shared entry delay before first card opens (Geist ~150ms) */
	delay?: number
	/** Shared close grace while moving between triggers / into the card */
	closeDelay?: number
}

export type ContextCardActivePayload = {
	content: React.ReactNode
	placement: Placement
	align: FloatingAlign
	tip: boolean
	className?: string
}
