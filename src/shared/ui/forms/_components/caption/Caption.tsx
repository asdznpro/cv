'use client'

import { twMerge } from 'tailwind-merge'

import { useFormItem } from '../../form-item/FormItem.context'
import { captionVariants } from './caption.variants'
import type { CaptionProps } from './Caption.interface'

export function Caption(props: CaptionProps) {
	const formItem = useFormItem()

	const {
		children,
		id,
		status: statusProp,
		prefix,
		className,
		...restProps
	} = props

	const status = statusProp ?? formItem?.status ?? 'default'

	return (
		<div
			{...restProps}
			id={id ?? formItem?.captionId}
			role={status === 'error' ? 'alert' : undefined}
			className={twMerge('root', captionVariants({ status }), className)}
		>
			{prefix && <span className='prefix'>{prefix}</span>}

			<span>{children}</span>
		</div>
	)
}
