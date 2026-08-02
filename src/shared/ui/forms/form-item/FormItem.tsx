'use client'

import { useCallback, useId, useMemo, useState } from 'react'
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
	const [hasLabel, setHasLabelState] = useState(false)
	const setHasLabel = useCallback((next: boolean) => {
		setHasLabelState(next)
	}, [])

	const value = useMemo(
		() => ({
			id,
			status,
			required,
			optional,
			disabled,
			captionId,
			hasLabel,
			setHasLabel,
		}),
		[
			id,
			status,
			required,
			optional,
			disabled,
			captionId,
			hasLabel,
			setHasLabel,
		],
	)

	return (
		<FormItemProvider value={value}>
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
