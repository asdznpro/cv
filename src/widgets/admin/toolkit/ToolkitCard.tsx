'use client'

import type { ToolkitItem } from 'lib/toolkit'

import { Button } from 'ui/blocks'
import { DropdownMenu } from 'ui/floating'
import { ToolkitCard as ToolkitCardView } from 'widgets/toolkit'

import {
	Icon28MoreHorizontal,
	Icon28EditOutline,
	Icon28DeleteOutline,
} from '@vkontakte/icons'

type ToolkitCardProps = {
	item: ToolkitItem
	onEdit: () => void
	onDelete: () => void
}

export function ToolkitCard({ item, onEdit, onDelete }: ToolkitCardProps) {
	return (
		<ToolkitCardView
			item={item}
			action={
				<div className="relative z-1 flex gap-2">
					<DropdownMenu>
						<DropdownMenu.Trigger>
							<Button
								size="sm"
								mode="ghost"
								appearance="neutral"
								prefix={<Icon28MoreHorizontal width={16} height={16} />}
								iconOnly
							/>
						</DropdownMenu.Trigger>

						<DropdownMenu.Content className="w-32">
							<DropdownMenu.Box>
								<DropdownMenu.Item
									onClick={onEdit}
									aria-label="Edit toolkit item"
									prefix={<Icon28EditOutline width={18} height={18} />}
								>
									Edit
								</DropdownMenu.Item>

								<DropdownMenu.Item
									onClick={onDelete}
									aria-label="Delete toolkit item"
									appearance="danger"
									prefix={<Icon28DeleteOutline width={18} height={18} />}
								>
									Delete
								</DropdownMenu.Item>
							</DropdownMenu.Box>
						</DropdownMenu.Content>
					</DropdownMenu>
				</div>
			}
		/>
	)
}
