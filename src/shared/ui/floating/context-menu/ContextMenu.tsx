'use client'

import { DropdownMenu } from '../dropdown-menu'
import type DropdownMenuProps from '../dropdown-menu/DropdownMenu.interface'

function ContextMenuRoot(props: DropdownMenuProps) {
	return (
		<DropdownMenu
			{...props}
			placement='right-start'
			align='start'
			trigger='contextmenu'
		/>
	)
}

type ContextMenuComponent = typeof ContextMenuRoot & {
	Trigger: typeof DropdownMenu.Trigger
	Content: typeof DropdownMenu.Content
	Box: typeof DropdownMenu.Box
	Heading: typeof DropdownMenu.Heading
	Item: typeof DropdownMenu.Item
	Sub: typeof DropdownMenu.Sub
	SubTrigger: typeof DropdownMenu.SubTrigger
	SubContent: typeof DropdownMenu.SubContent
}

export const ContextMenu = ContextMenuRoot as ContextMenuComponent

ContextMenu.Trigger = DropdownMenu.Trigger
ContextMenu.Content = DropdownMenu.Content
ContextMenu.Box = DropdownMenu.Box
ContextMenu.Heading = DropdownMenu.Heading
ContextMenu.Item = DropdownMenu.Item
ContextMenu.Sub = DropdownMenu.Sub
ContextMenu.SubTrigger = DropdownMenu.SubTrigger
ContextMenu.SubContent = DropdownMenu.SubContent

ContextMenuRoot.displayName = 'ContextMenu'
