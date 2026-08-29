'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'

import { useClipboard } from '@siberiacancode/reactuse'
import { Icon28CopyOutline, Icon28DoneOutline } from '@vkontakte/icons'

import { Button } from '../button'
import type { CopyButtonProps } from './CopyButton.interface'

const ICON_SIZE = {
	sm: 16,
	md: 18,
	lg: 20,
} as const

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
	(props, ref) => {
		const {
			value,
			timeout = 2000,
			copiedChildren,
			onCopied,
			children,
			iconOnly,
			size = 'md',
			mode = 'soft',
			onClick,
			disabled,
			'aria-label': ariaLabel,
			...restProps
		} = props

		const { copy } = useClipboard()
		const [copied, setCopied] = useState(false)
		const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

		useEffect(
			() => () => {
				if (timeoutRef.current) clearTimeout(timeoutRef.current)
			},
			[],
		)

		const iconSize = ICON_SIZE[size]
		const hasLabel = Boolean(children) || Boolean(copied && copiedChildren)
		const isIconOnly = iconOnly ?? !hasLabel

		const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(event)
			if (event.defaultPrevented || disabled) return

			const text = typeof value === 'function' ? value() : value
			if (!text) return

			try {
				await copy(text)
			} catch {
				return
			}

			setCopied(true)
			onCopied?.(text)

			if (timeoutRef.current) clearTimeout(timeoutRef.current)
			timeoutRef.current = setTimeout(() => setCopied(false), timeout)
		}

		return (
			<Button
				{...restProps}
				ref={ref}
				type={restProps.type ?? 'button'}
				size={size}
				mode={mode}
				appearance={copied ? 'success' : 'neutral'}
				disabled={disabled}
				iconOnly={isIconOnly}
				aria-label={ariaLabel ?? (copied ? 'Copied' : 'Copy')}
				prefix={
					copied ? (
						<Icon28DoneOutline width={iconSize} height={iconSize} />
					) : (
						<Icon28CopyOutline width={iconSize} height={iconSize} />
					)
				}
				onClick={handleClick}
			>
				{copied ? (copiedChildren ?? children) : children}
			</Button>
		)
	},
)

CopyButton.displayName = 'CopyButton'
