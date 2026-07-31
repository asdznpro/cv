'use client'

import { twMerge } from 'tailwind-merge'

import { useFormItem } from '../form-item/FormItem.context'
import type { LabelProps } from './Label.interface'

export function Label(props: LabelProps) {
	const formItem = useFormItem()

	const {
		children,
		htmlFor,
		prefix,
		suffix,
		required: requiredProp,
		optional: optionalProp,
		className,
		...restProps
	} = props

	const required = requiredProp ?? formItem?.required ?? false
	const optional = optionalProp ?? formItem?.optional ?? false

	return (
		<label
			{...restProps}
			htmlFor={htmlFor ?? formItem?.id}
			className={twMerge(
				'root flex items-center gap-1.5',
				'text-sm 0font-condensed font-medium',
				className,
			)}
		>
			{prefix && (
				<span className='prefix text-foreground-secondary'>{prefix}</span>
			)}

			<span className='min-w-0 flex gap-1'>
				<span className='truncate'>{children}</span>

				{optional && !required && (
					<span className='text-foreground-secondary select-none'>
						(optional)
					</span>
				)}

				{required && <span className='text-danger select-none'>*</span>}
			</span>

			{suffix && (
				<span className='suffix ml-auto text-foreground-secondary'>
					{suffix}
				</span>
			)}
		</label>
	)
}
