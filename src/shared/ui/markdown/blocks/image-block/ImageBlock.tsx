import Image from 'next/image'

type ImageBlockProps = {
	src: string
	alt?: string
	caption?: string
	variant?: 'framed' | 'plain'
}

export function ImageBlock({
	src,
	alt = '',
	caption,
	variant = 'framed',
}: ImageBlockProps) {
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
		<figure className='not-prose my-6! flex flex-col gap-4'>
			{variant === 'framed' ? (
				<div className='overflow-hidden rounded-lg border border-separator bg-surface'>
					{image}
				</div>
			) : (
				image
			)}

			{caption ? (
				<figcaption className='text-center text-sm text-foreground-secondary'>
					{caption}
				</figcaption>
			) : null}
		</figure>
	)
}
