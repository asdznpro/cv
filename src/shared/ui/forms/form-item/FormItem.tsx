'use client'

import { useId } from 'react'
import { twMerge } from 'tailwind-merge'

import { FormItemProvider } from './FormItem.context'
import type { FormItemProps } from './FormItem.interface'

export function FormItem(props: FormItemProps) {
	const {
		children,
		className,
		status = 'default',
		required = false,
		optional = false,
		disabled = false,
		id: idProp,
		...restProps
	} = props

	const reactId = useId()
	const id = idProp ?? reactId
	const captionId = `${id}-caption`

	return (
		<FormItemProvider
			value={{
				id,
				status,
				required,
				optional,
				disabled,
				captionId,
			}}
		>
			<div
				{...restProps}
				data-status={status}
				data-disabled={disabled || undefined}
				className={twMerge('root flex flex-col gap-3', className)}
			>
				{children}
			</div>
		</FormItemProvider>
	)
}
