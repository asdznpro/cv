'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'

import { twMerge } from 'tailwind-merge'
import {
	Icon16Done,
	Icon20MinusOutline,
	Icon28DoneOutline,
	Icon28MinusOutline,
} from '@vkontakte/icons'

import { useFormItem } from '../form-item/FormItem.context'
import { checkboxVariants } from './checkbox.variants'
import type CheckboxProps from './Checkbox.interface'

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
	if (typeof ref === 'function') {
		ref(value)
		return
	}

	if (ref) {
		ref.current = value
	}
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	function Checkbox(props, ref) {
		const formItem = useFormItem()
		const inputRef = useRef<HTMLInputElement | null>(null)

		const {
			indeterminate = false,
			className,
			id,
			disabled,
			required,
			checked,
			defaultChecked,
			onChange,
			...restProps
		} = props

		const isControlled = checked !== undefined
		const [uncontrolledChecked, setUncontrolledChecked] = useState(
			Boolean(defaultChecked),
		)
		const isChecked = isControlled ? Boolean(checked) : uncontrolledChecked

		const isDisabled = disabled ?? formItem?.disabled ?? false
		const isRequired = required ?? formItem?.required ?? false
		const fieldId = id ?? formItem?.id
		const status = formItem?.status ?? 'default'
		const describedBy =
			formItem && status === 'error' ? formItem.captionId : undefined

		useEffect(() => {
			const el = inputRef.current
			if (el) el.indeterminate = indeterminate
		}, [indeterminate])

		const state = indeterminate ? 'mixed' : isChecked ? 'on' : 'off'

		return (
			<span className={twMerge('root', checkboxVariants({ state }), className)}>
				<input
					{...restProps}
					ref={node => {
						inputRef.current = node
						assignRef(ref, node)
					}}
					type='checkbox'
					id={fieldId}
					checked={isControlled ? checked : undefined}
					defaultChecked={isControlled ? undefined : defaultChecked}
					disabled={isDisabled}
					required={isRequired}
					aria-checked={indeterminate ? 'mixed' : isChecked}
					aria-invalid={status === 'error' || undefined}
					aria-required={isRequired || undefined}
					aria-describedby={describedBy}
					onChange={event => {
						if (!isControlled) {
							setUncontrolledChecked(event.currentTarget.checked)
						}
						onChange?.(event)
					}}
					className={twMerge(
						'absolute inset-0 z-1 m-0 size-full opacity-0',
						'cursor-pointer disabled:cursor-not-allowed',
					)}
				/>

				<span className='pointer-events-none flex items-center justify-center'>
					{state === 'on' && <Icon28DoneOutline width={18} height={18} />}
					{state === 'mixed' && <Icon28MinusOutline width={18} height={18} />}
				</span>
			</span>
		)
	},
)
