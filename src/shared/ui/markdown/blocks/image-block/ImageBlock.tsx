'use client'

import { useId } from 'react'
import Image from 'next/image'

import { twMerge } from 'tailwind-merge'
import { motion } from 'motion/react'

import { Badge, PreviewCard, PreviewCardProps } from 'ui/blocks'

import { useLightbox } from '../image-lightbox'

type ImageBlockProps = {
	id?: string
	src: string
	alt?: string
	caption?: string
	variant?: 'framed' | 'plain'
	ratio?: PreviewCardProps['ratio']
	masonry?: boolean
}

export function ImageBlock({
	src,
	alt = '',
	caption,
	variant = 'framed',
	ratio,
	masonry,
}: ImageBlockProps) {
	const reactId = useId()
	const id = `md-img:${reactId}`

	const { open, active } = useLightbox()

	const normalizedSrc = src.startsWith('//') ? `https:${src}` : src
	const isLocal =
		normalizedSrc.startsWith('/') && !normalizedSrc.startsWith('//')

	const image = isLocal ? (
		<Image
			src={normalizedSrc}
			alt={alt}
			width={1200}
			height={675}
			className='h-auto w-full'
			sizes='(min-width: 768px) 768px, 100vw'
		/>
	) : (
		<img
			src={normalizedSrc}
			alt={alt}
			className='h-auto w-full'
			loading='lazy'
		/>
	)

	return (
		<figure
			className={twMerge(
				'not-prose flex flex-col gap-4',
				masonry ? 'my-0!' : 'my-6!',
			)}
		>
			<button
				type='button'
				onClick={() =>
					open({
						id,
						src,
						alt,
						caption,
						variant,
						ratio: ratio ?? 'video',
					})
				}
				className='contents cursor-zoom-in'
			>
				<motion.div
					layoutId={id}
					className={twMerge(
						'flex',
						active?.id === id ? 'opacity-0' : 'opacity-100',
					)}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
				>
					{variant === 'framed' ? (
						<PreviewCard
							ratio={ratio ?? 'video'}
							src={src}
							alt={alt}
							sizes='(max-width: 768px) 100vw, 50vw'
						>
							{masonry && caption && (
								<Badge
									className='z-1 absolute bottom-2 left-1/2 -translate-x-1/2 max-w-[calc(100%-1rem)] truncate pointer-events-none'
									appearance='neutral'
									size='md'
									radius='smooth'
								>
									{caption}
								</Badge>
							)}
						</PreviewCard>
					) : (
						image
					)}
				</motion.div>
			</button>

			{!masonry && caption && (
				<figcaption className='text-center text-sm text-foreground-secondary'>
					{caption}
				</figcaption>
			)}
		</figure>
	)
}
