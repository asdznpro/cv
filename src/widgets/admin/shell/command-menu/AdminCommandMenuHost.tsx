'use client'

import { useHotkeys } from '@siberiacancode/reactuse'

import { useAdminCommandMenu } from './useAdminCommandMenu'

/** Cross-platform: Ctrl+K (Windows/Linux) / ⌘K (macOS). */
export const COMMAND_MENU_HOTKEY = {
	label: ['Ctrl', 'K'] as const,
	match: 'mod+k, mod+л',
}

/**
 * Registers global Ctrl/⌘K for the admin command menu.
 * Mount once under the admin panel shell.
 */
export function AdminCommandMenuHost() {
	const { openCommandMenu } = useAdminCommandMenu()

	useHotkeys(COMMAND_MENU_HOTKEY.match, () => {
		openCommandMenu()
	})

	return null
}
