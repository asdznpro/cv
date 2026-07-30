'use client'

import { forwardRef } from 'react'

import { twMerge } from 'tailwind-merge'

import { useFormItem } from '../form-item/FormItem.context'
import { inputVariants } from './input.variants'
import type InputProps from './Input.interface'

import { FieldSurface } from '../field-surface'

export const Input = forwardRef<HTMLInputElement, InputProps>(
	function Input(props, ref) {
		const formItem = useFormItem()

		const {
			status: statusProp,
			mode,
			size,
			radius,
			prefix,
			suffix,
			className,
			id,
			disabled,
			required,
			...restProps
		} = props

		const status = statusProp ?? formItem?.status ?? 'default'
		const isDisabled = disabled ?? formItem?.disabled ?? false
		const isRequired = required ?? formItem?.required ?? false
		const fieldId = id ?? formItem?.id
		const describedBy =
			formItem && status === 'error' ? formItem.captionId : undefined

		return (
			<span
				className={twMerge(
					'root',
					inputVariants({ mode, status, size, radius }),
					className,
				)}
			>
				<FieldSurface
					mode={mode}
					status={status}
					radius={radius}
					disabled={isDisabled}
				/>

				<span className='in relative w-full h-full flex items-center justify-center py-1'>
					<span className='spacing w-0 h-full' />

					{prefix && (
						<span className='prefix flex gap-0.5 text-foreground-secondary'>
							{prefix}
						</span>
					)}

					<input
						{...restProps}
						ref={ref}
						id={fieldId}
						disabled={isDisabled}
						required={isRequired}
						aria-invalid={status === 'error' || undefined}
						aria-required={isRequired || undefined}
						aria-describedby={describedBy}
						className='content w-full h-full px-0.5 rounded-xs appearance-none outline-none placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary disabled:text-foreground-secondary disabled:cursor-not-allowed'
					/>

					{suffix && (
						<span className='suffix flex gap-0.5 text-foreground-secondary'>
							{suffix}
						</span>
					)}

					<span className='spacing w-0 h-full' />
				</span>
			</span>
		)
	},
)
