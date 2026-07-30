import { twMerge } from 'tailwind-merge'

import { captionVariants } from './caption.variants'
import type { CaptionProps } from './Caption.interface'

export function Caption(props: CaptionProps) {
	const { children, status, prefix, className, ...restProps } = props

	return (
		<div
			{...restProps}
			className={twMerge('root', captionVariants({ status }), className)}
		>
			{prefix && <span className='prefix'>{prefix}</span>}

			<span className=''>{children}</span>
		</div>
	)
}
