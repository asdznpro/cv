'use client'

import { forwardRef } from 'react'

import { useTextareaAutosize } from '@siberiacancode/reactuse'
import { twMerge } from 'tailwind-merge'

import { textareaVariants } from './textarea.variants'
import type TextareaProps from './Textarea.interface'

import { ExpandIndicator } from './ExpandIndicator'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea(props, ref) {
		const {
			status,
			mode,
			size,
			radius,
			resize = 'vertical',
			className,
			...restProps
		} = props

		const message = useTextareaAutosize()

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
				<span className='in w-full h-full flex items-center justify-center'>
					<textarea
						{...restProps}
						ref={message.ref}
						className='textarea resize-none scrollbar w-full rounded-xs appearance-none outline-none placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary disabled:text-foreground-secondary disabled:cursor-not-allowed'
					/>

					{isResizable && !restProps.disabled && (
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
