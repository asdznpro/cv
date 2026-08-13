import type { Placement } from '@floating-ui/react'
import type { ReactElement, ReactNode } from 'react'

import type { ButtonProps } from 'ui/blocks'

import type { FloatingAlign } from '../lib'

export default interface DropdownMenuProps {
	children: ReactNode
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	placement?: Placement
	align?: FloatingAlign
}

export interface DropdownMenuTriggerProps {
	children: ReactElement
	className?: string
}

export interface DropdownMenuContentProps {
	children: ReactNode
	className?: string
	style?: React.CSSProperties
	id?: string
}

export interface DropdownMenuBoxProps {
	children: ReactNode
	className?: string
}

/** Non-interactive group title. At most one per `DropdownMenu.Box`. */
export interface DropdownMenuHeadingProps {
	children: ReactNode
	className?: string
}

/** Menu row — Button with fixed `mode="ghost"` / `align="between"`. */
export type DropdownMenuItemProps = Pick<
	ButtonProps,
	| 'children'
	| 'className'
	| 'prefix'
	| 'suffix'
	| 'appearance'
	| 'disabled'
	| 'onClick'
	| 'to'
	| 'href'
	| 'target'
> & {
	/** Close the whole menu tree after click. Default `true`. */
	closeOnSelect?: boolean
}

export interface DropdownMenuSubProps {
	children: ReactNode
}

/** Nested trigger — Button-like; chevron suffix is built-in. */
export type DropdownMenuSubTriggerProps = Pick<
	ButtonProps,
	'children' | 'className' | 'prefix' | 'appearance' | 'disabled'
>
