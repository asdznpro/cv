type QuoteBlockProps = {
	quote: string
	attribution?: string
	variant?: 'pull' | 'border'
	avatar?: string
	authorName?: string
	authorTitle?: string
}

export function QuoteBlock({
	quote,
	attribution,
	variant = 'border',
	avatar,
	authorName,
	authorTitle,
}: QuoteBlockProps) {
	if (variant === 'pull') {
		return (
			<figure className='not-prose my-6! flex flex-col gap-surface'>
				<blockquote className='relative text-2xl @lg:text-3xl font-normal leading-[1.2] tracking-tight **:inline'>
					<span
						aria-hidden='true'
						className='absolute top-0 -left-3 select-none'
					>
						&ldquo;
					</span>

					<span>{quote}</span>

					<span aria-hidden='true' className='select-none'>
						&rdquo;
					</span>
				</blockquote>

				{(authorName || attribution) && (
					<figcaption className='flex items-center gap-3 text-sm text-foreground-secondary'>
						{avatar && (
							<img
								src={avatar}
								alt={authorName ?? ''}
								className='size-8 shrink-0 rounded-full object-cover'
								loading='lazy'
							/>
						)}

						<span>
							{authorName && (
								<span className='text-foreground'>{authorName}</span>
							)}

							{authorTitle && (
								<span className='text-foreground-secondary'>
									{' '}
									{authorTitle}
								</span>
							)}

							{!authorName && attribution}
						</span>
					</figcaption>
				)}
			</figure>
		)
	}

	return (
		<blockquote className='not-prose my-6! flex flex-col p-surface gap-surface bg-surface border border-separator rounded-xl'>
			<p className='relative m-0! text-2xl font-medium tracking-tight'>
				{quote}

				<span
					aria-hidden='true'
					className='absolute top-0 -left-surface w-1 h-full bg-accent rounded-r-full'
				/>
			</p>

			{attribution && (
				<footer className='mt-0 block font-normal text-sm text-foreground-secondary'>
					{attribution}
				</footer>
			)}
		</blockquote>
	)
}
