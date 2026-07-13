'use client'

import { useLayoutEffect, useState } from 'react'

export function useOverflow(
	viewportRef: React.RefObject<HTMLElement | null>,
	contentRef: React.RefObject<HTMLElement | null>,
) {
	const [overflowing, setOverflowing] = useState(false)

	useLayoutEffect(() => {
		const viewport = viewportRef.current
		const content = contentRef.current

		if (!viewport || !content) return

		const update = () => {
			setOverflowing(content.scrollWidth > viewport.clientWidth + 1)
		}

		update()

		const observer = new ResizeObserver(update)

		observer.observe(viewport)
		observer.observe(content)

		document.fonts.ready.then(update)

		return () => observer.disconnect()
	}, [viewportRef, contentRef])

	return overflowing
}
