'use client'

import { useMount } from '@siberiacancode/reactuse'

export function HashScroll() {
	useMount(() => {
		const id = decodeURIComponent(window.location.hash.slice(1))
		if (!id) return

		let attempts = 0
		const maxAttempts = 60

		const tryScroll = () => {
			const el = document.getElementById(id)
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' })
				return
			}
			if (attempts++ < maxAttempts) {
				requestAnimationFrame(tryScroll)
			}
		}

		tryScroll()
	})

	return null
}
