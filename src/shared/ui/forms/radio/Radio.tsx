'use client'

import { forwardRef } from 'react'

import { twMerge } from 'tailwind-merge'

import { useFormItem } from '../form-item/FormItem.context'
import { radioVariants } from './radio.variants'
import type RadioProps from './Radio.interface'

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
	function Radio(props, ref) {
		const formItem = useFormItem()

		const { className, id, disabled, required, ...restProps } = props

		const isDisabled = disabled ?? formItem?.disabled ?? false
		const isRequired = required ?? formItem?.required ?? false
		const fieldId = id ?? formItem?.id
		const status = formItem?.status ?? 'default'
		const describedBy =
			formItem && status === 'error' ? formItem.captionId : undefined

		return (
			<span className={twMerge('root', radioVariants(), className)}>
				<input
					{...restProps}
					ref={ref}
					type='radio'
					id={fieldId}
					disabled={isDisabled}
					required={isRequired}
					aria-invalid={status === 'error' || undefined}
					aria-required={isRequired || undefined}
					aria-describedby={describedBy}
					className={twMerge(
						'absolute inset-0 z-1 m-0 size-full opacity-0',
						'cursor-pointer disabled:cursor-not-allowed',
					)}
				/>

				<span
					aria-hidden
					className='pointer-events-none size-2 rounded-full bg-white transition-opacity duration-100 ease-in'
				/>
			</span>
		)
	},
)
