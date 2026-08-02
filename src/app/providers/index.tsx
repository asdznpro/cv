'use client'

import type { ReactNode } from 'react'

import { OverlayProvider } from 'ui/overlays'

export function Providers({ children }: { children: ReactNode }) {
	return <OverlayProvider>{children}</OverlayProvider>
}
