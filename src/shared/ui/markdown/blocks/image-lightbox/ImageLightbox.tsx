'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { createPortal } from 'react-dom'

import { Button, Kbd, PreviewCard } from 'ui/blocks'
import { Backdrop } from 'ui/overlays'
import { Icon28CancelOutline } from '@vkontakte/icons'

import { useLightbox } from './LightboxProvider'

const AR: Record<string, number> = {
	'4:1': 4 / 1,
	'3:1': 3 / 1,
	'5:2': 5 / 2,
	'2:1': 2 / 1,
	video: 16 / 9,
	'3:2': 3 / 2,
	'4:3': 4 / 3,
	'5:4': 5 / 4,
	square: 1,
	'4:5': 4 / 5,
	'3:4': 3 / 4,
	'2:3': 2 / 3,
	story: 1 / 2,
	'1:2': 1 / 2,
	'2:5': 2 / 5,
	'1:3': 1 / 3,
	'1:4': 1 / 4,
	auto: 1,
}

export function ImageLightbox() {
	const { active, close } = useLightbox()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return createPortal(
		<AnimatePresence>
			{active && (
				<Backdrop
					key='lightbox-backdrop'
					className='z-30'
					aria-hidden
					onClick={close}
				/>
			)}

			{active && (
				<motion.div
					key='lightbox-close'
					className='fixed top-4 right-4 z-50'
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.2 }}
				>
					<Button
						onClick={close}
						type='button'
						aria-label='Закрыть'
						mode='secondary'
						appearance='neutral'
						prefix={<Icon28CancelOutline width={18} height={18} />}
						suffix={<Kbd size='sm' keys={['Esc']} radius='rounded' />}
						radius='rounded'
					>
						Close
					</Button>
				</motion.div>
			)}

			{active && (
				<div
					key='lightbox-stage'
					className='fixed inset-0 z-40 flex items-center justify-center pointer-events-none'
				>
					<motion.div
						layoutId={active.id}
						className='pointer-events-auto w-auto max-w-full'
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					>
						{active.variant !== 'plain' ? (
							<PreviewCard
								ratio={active.ratio ?? 'video'}
								src={active.src}
								alt={active.alt}
								sizes='90vw'
								className='w-auto max-w-full max-h-full'
								style={{
									width: `min(calc(100vw - 2rem), calc(100vh - 2rem) * ${AR[active.ratio ?? 'video']})`,
								}}
							>
								{/* {active.caption && (
										<Badge
											className='z-1 absolute bottom-2 left-1/2 -translate-x-1/2 max-w-[calc(100%-1rem)] truncate pointer-events-none'
											appearance='neutral'
											size='md'
											radius='smooth'
										>
											{active.caption}
										</Badge>
									)} */}
							</PreviewCard>
						) : (
							<img
								src={active.src}
								alt={active.alt ?? ''}
								className='h-auto w-full rounded-xl'
							/>
						)}
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body,
	)
}
