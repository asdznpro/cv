'use client'

import { type RefObject, useLayoutEffect, useState } from 'react'

const ELLIPSIS = '\u2026'

function fits(node: HTMLElement) {
	return node.scrollWidth <= node.clientWidth
}

function truncateMiddle(node: HTMLElement, value: string) {
	node.textContent = value
	if (node.clientWidth <= 0 || fits(node)) return value

	const chars = Array.from(value)
	let low = 0
	let high = chars.length
	let best = ELLIPSIS

	while (low <= high) {
		const keep = Math.floor((low + high) / 2)
		const prefixLength = Math.ceil(keep / 2)
		const suffixLength = Math.floor(keep / 2)
		const candidate = `${chars.slice(0, prefixLength).join('')}${ELLIPSIS}${chars.slice(chars.length - suffixLength).join('')}`
		node.textContent = candidate

		if (fits(node)) {
			best = candidate
			low = keep + 1
		} else {
			high = keep - 1
		}
	}

	node.textContent = best
	return best
}

export function useMiddleTruncate(
	ref: RefObject<HTMLElement | null>,
	value: string,
) {
	const [displayed, setDisplayed] = useState(value)

	useLayoutEffect(() => {
		const node = ref.current
		if (!node) return

		let frame = 0
		let cancelled = false

		const update = () => {
			if (cancelled) return
			setDisplayed(truncateMiddle(node, value))
		}

		update()
		void document.fonts?.ready.then(update)

		const observer = new ResizeObserver(() => {
			cancelAnimationFrame(frame)
			frame = requestAnimationFrame(update)
		})
		observer.observe(node)

		return () => {
			cancelled = true
			cancelAnimationFrame(frame)
			observer.disconnect()
		}
	}, [ref, value])

	return displayed
}
