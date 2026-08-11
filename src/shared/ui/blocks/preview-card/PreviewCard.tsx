'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { twMerge } from 'tailwind-merge'

import { previewCardVariants } from './preview-card.variants'
import type { PreviewCardProps } from './PreviewCard.interface'

import { FlickerSpinner } from 'ui/blocks'

import { Icon28PictureOutline } from '@vkontakte/icons'

type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error'

const DEFAULT_SIZES = '(max-width: 768px) 100vw, 33vw'

function isImageReady(img: HTMLImageElement) {
	return img.complete && img.naturalWidth > 0
}

export function PreviewCard(props: PreviewCardProps) {
	const {
		children,
		ratio,
		src,
		alt,
		className,
		sizes = DEFAULT_SIZES,
		quality,
		priority,
		radius,
		inner,
		...restProps
	} = props

	const [status, setStatus] = useState<ImageStatus>(() =>
		src ? 'loading' : 'idle',
	)

	useEffect(() => {
		setStatus(src ? 'loading' : 'idle')
	}, [src])

	const markLoaded = useCallback(() => {
		setStatus('loaded')
	}, [])

	const markError = useCallback(() => {
		setStatus('error')
	}, [])

	const handleRef = useCallback(
		(node: HTMLImageElement | null) => {
			if (node && isImageReady(node)) {
				markLoaded()
			}
		},
		[markLoaded],
	)

	const showPlaceholder = !src || status === 'loading' || status === 'error'
	const showSpinner = Boolean(src) && status === 'loading'

	return (
		<div
			{...restProps}
			className={twMerge(
				'relative root',
				previewCardVariants({ ratio, radius }),
				className,
			)}
		>
			{children}

			<div className='in z-0 relative w-full h-full flex items-center justify-center text-foreground-tertiary bg-surface border border-separator overflow-hidden transition-all duration-100 ease-in focus-ring-base focus-ring-group-visible'>
				{showPlaceholder && (
					<div
						className={twMerge(
							'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
							status === 'loaded' ? 'opacity-0' : 'opacity-100',
						)}
						aria-hidden={status === 'loaded'}
					>
						{showSpinner ? (
							<FlickerSpinner size={28} />
						) : (
							<Icon28PictureOutline className='max-h-[32%]' />
						)}
					</div>
				)}

				{src && status !== 'error' && (
					<Image
						ref={handleRef}
						key={src}
						src={src}
						alt={alt ?? ''}
						fill
						sizes={sizes}
						priority={priority}
						quality={quality}
						className={twMerge(
							'object-cover transition-all duration-500 ease-out group-hover:scale-110 group-focus-visible:scale-110 group-active:scale-105',
							status === 'loaded' ? 'opacity-100' : 'opacity-0',
						)}
						onLoad={markLoaded}
						onError={markError}
						loading='eager'
					/>
				)}

				{inner}
			</div>
		</div>
	)
}
