'use client'

import { useEffect, useState } from 'react'
import { useHotkeys, useWindowScroll } from '@siberiacancode/reactuse'
import { AnimatePresence, motion } from 'motion/react'

import { Button, Kbd } from 'ui/blocks'
import { Icon28ArrowUpOutline } from '@vkontakte/icons'

const SHOW_AFTER_PX = 400

export function BackToTop() {
	const [ready, setReady] = useState(false)
	const windowScroll = useWindowScroll()
	const { y } = windowScroll.watch()
	
	useEffect(() => setReady(true), [])
	
	const visible = ready && y > SHOW_AFTER_PX

	const scrollTop = () => {
		windowScroll.scrollTo({ x: 0, y: 0, behavior: 'smooth' })
	}

	useHotkeys('shift+t, shift+е', event => {
		event.preventDefault()
		scrollTop()
	})

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					key='back-to-top'
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 24 }}
					transition={{ duration: 0.15 }}
				>
					<Button
						onClick={scrollTop}
						size='lg'
						mode='secondary'
						appearance='neutral'
						prefix={<Icon28ArrowUpOutline width={20} height={20} />}
						suffix={<Kbd>Shift + T</Kbd>}
						radius='rounded'
					>
						Back to Top
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
