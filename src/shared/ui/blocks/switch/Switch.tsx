'use client'

import { forwardRef, useState } from 'react'

import { twMerge } from 'tailwind-merge'

import { switchVariants } from './switch.variants'
import type SwitchProps from './Switch.interface'

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
	function Switch(props, ref) {
		const {
			appearance,
			icon,
			checkedIcon,
			className,
			disabled,
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

		return (
			<span
				className={twMerge('root', switchVariants({ appearance }), className)}
			>
				<input
					{...restProps}
					ref={ref}
					type='checkbox'
					role='switch'
					checked={isChecked}
					disabled={disabled}
					aria-checked={isChecked}
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

				<span
					aria-hidden
					className={twMerge(
						'thumb pointer-events-none absolute top-0.5 left-0.5 size-4',
						'inline-flex items-center justify-center overflow-hidden',
						'rounded-full bg-white',
						'transition-[translate,color] duration-120 ease-in',
					)}
				>
					{icon != null && checkedIcon != null ? (
						<span
							className={twMerge(
								'icons absolute inset-y-0 left-0 flex w-8',
								'transition-[translate] duration-120 ease-in',
							)}
						>
							<span className='inline-flex size-4 shrink-0 items-center justify-center'>
								{icon}
							</span>
							<span className='inline-flex size-4 shrink-0 items-center justify-center'>
								{checkedIcon}
							</span>
						</span>
					) : (
						<>
							{icon != null && <span className='inline-flex'>{icon}</span>}
							{checkedIcon != null && (
								<span className='icon-on inline-flex'>{checkedIcon}</span>
							)}
						</>
					)}
				</span>
			</span>
		)
	},
)
