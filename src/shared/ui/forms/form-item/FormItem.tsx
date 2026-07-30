import { twMerge } from 'tailwind-merge'

import type { FormItemProps } from './FormItem.interface'

export function FormItem(props: FormItemProps) {
	const { children, className, ...restProps } = props

	return (
		<label
			{...restProps}
			className={twMerge('root flex flex-col gap-3', className)}
		>
			{children}
		</label>
	)
}
