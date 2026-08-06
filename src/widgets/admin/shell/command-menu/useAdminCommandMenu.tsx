'use client'

import { useCallback } from 'react'

import { CommandMenu, useOverlay } from 'ui/overlays'

export function useAdminCommandMenu() {
	const { open, close } = useOverlay()

	const openCommandMenu = useCallback(() => {
		open(<CommandMenu onClose={() => close()} />)
	}, [open, close])

	return { openCommandMenu }
}
