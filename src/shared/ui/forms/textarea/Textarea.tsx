'use client'

import { forwardRef, useCallback } from 'react'

import { useTextareaAutosize } from '@siberiacancode/reactuse'
import { twMerge } from 'tailwind-merge'

import { useFormItem } from '../form-item/FormItem.context'
import { textareaVariants } from './textarea.variants'
import type TextareaProps from './Textarea.interface'

import { FieldSurface } from '../field-surface'
import { ExpandIndicator } from './ExpandIndicator'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea(props, ref) {
		const formItem = useFormItem()

		const {
			status: statusProp,
			mode,
			size,
			radius,
			resize = 'vertical',
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

		const message = useTextareaAutosize()

		const setRefs = useCallback(
			(node: HTMLTextAreaElement | null) => {
				message.ref.current = node as HTMLTextAreaElement
				if (typeof ref === 'function') ref(node)
				else if (ref) ref.current = node
			},
			[message.ref, ref],
		)

		const isResizable = resize !== 'none'

		const resizeCursor = {
			vertical: 'cursor-ns-resize',
			horizontal: 'cursor-ew-resize',
			both: 'cursor-nwse-resize',
		} as const

		const startResize = (
			e: React.PointerEvent,
			axis: 'vertical' | 'horizontal' | 'both',
		) => {
			e.preventDefault()
			const el = message.ref.current!

			const startY = e.clientY
			const startH = el.offsetHeight

			const minHeight = Math.max(
				parseFloat(getComputedStyle(el).minHeight) || 0,
				startH,
			)

			const onMove = (ev: PointerEvent) => {
				if (axis === 'vertical') {
					const nextH = startH + (ev.clientY - startY)
					el.style.height = `${Math.max(minHeight, nextH)}px`
				}
			}

			const onUp = () => {
				window.removeEventListener('pointermove', onMove)
				window.removeEventListener('pointerup', onUp)
			}

			window.addEventListener('pointermove', onMove)
			window.addEventListener('pointerup', onUp)
		}

		return (
			<span
				className={twMerge(
					'root',
					textareaVariants({ mode, status, size, radius }),
					className,
				)}
			>
				<FieldSurface
					mode={mode}
					status={status}
					radius={radius}
					disabled={isDisabled}
				/>

				<span className='in relative w-full h-full flex items-center justify-center'>
					<textarea
						{...restProps}
						ref={setRefs}
						id={fieldId}
						disabled={isDisabled}
						required={isRequired}
						aria-invalid={status === 'error' || undefined}
						aria-required={isRequired || undefined}
						aria-describedby={describedBy}
						className='textarea resize-none scrollbar-none w-full rounded-xs appearance-none outline-none placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary disabled:text-foreground-secondary disabled:cursor-not-allowed'
					/>

					{isResizable && !isDisabled && (
						<span
							onPointerDown={e => startResize(e, resize)}
							className={twMerge(
								'absolute bottom-1 right-1',
								resizeCursor[resize],
							)}
						>
							<ExpandIndicator
								size={12}
								className='transition-all duration-100 text-foreground-tertiary hover:text-foreground'
							/>
						</span>
					)}
				</span>
			</span>
		)
	},
)
