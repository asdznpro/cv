'use client'

import { useMemo } from 'react'

import type { AdminNotification, NotificationStatus } from 'lib/notifications'
import { getFormattedDate } from 'lib/utils'

import { Badge, Button, EmptyState } from 'ui/blocks'
import { DropdownMenu } from 'ui/floating'

import {
	Icon28ChainOutline,
	Icon28DeleteOutline,
	Icon28DoneOutline,
	Icon28LinkOutline,
	Icon28MoreHorizontal,
	Icon28NotificationDisableOutline,
	Icon28Notifications,
} from '@vkontakte/icons'

const GROUPS: { status: NotificationStatus; label: string }[] = [
	{ status: 'new', label: 'New' },
	{ status: 'viewed', label: 'Viewed' },
]

type NotificationListProps = {
	notifications: AdminNotification[]
	onStatusChange: (id: string, status: NotificationStatus) => void
	onDelete: (id: string) => void
}

export function NotificationList({
	notifications,
	onStatusChange,
	onDelete,
}: NotificationListProps) {
	const groups = useMemo(
		() =>
			GROUPS.map(group => ({
				...group,
				items: notifications.filter(item => item.status === group.status),
			})).filter(group => group.items.length > 0),
		[notifications],
	)

	if (groups.length === 0) {
		return (
			<EmptyState
				className='h-full'
				icon={<Icon28NotificationDisableOutline width={24} height={24} />}
				title='No notifications'
				summary='There are no notifications. You will receive notifications when there are new articles, short links, or other content.'
			/>
		)
	}

	return (
		<div className='flex flex-col p-2 gap-2'>
			{groups.map(group => (
				<div key={group.status} className='flex flex-col gap-2'>
					<span className='px-surface py-1 text-xs text-foreground-secondary'>
						{group.label}
					</span>

					{group.items.map(notification => (
						<NotificationItem
							key={notification.id}
							notification={notification}
							onStatusChange={onStatusChange}
							onDelete={onDelete}
						/>
					))}
				</div>
			))}
		</div>
	)
}

function NotificationItem({
	notification,
	onStatusChange,
	onDelete,
}: {
	notification: AdminNotification
	onStatusChange: (id: string, status: NotificationStatus) => void
	onDelete: (id: string) => void
}) {
	const isNew = notification.status === 'new'

	return (
		<div className='group flex flex-1 p-surface gap-surface rounded-md bg-surface-secondary/strong'>
			<Badge
				mode='soft'
				appearance={isNew ? 'accent' : 'neutral'}
				prefix={<Icon28ChainOutline width={16} height={16} />}
			/>

			<div className='flex flex-1 flex-col gap-2'>
				<h3 className='text-lg font-medium font-condensed tracking-tight'>
					{notification.title}
				</h3>

				{notification.description && (
					<p className='text-sm text-foreground-secondary'>
						{notification.description}
					</p>
				)}

				<p className='text-sm text-foreground-secondary'>
					{isNew && (
						<span className='mr-1.75 mb-0.5 inline-flex size-1.75 bg-accent rounded-full animate-pulse align-middle' />
					)}
					{
						getFormattedDate(notification.createdAt, { includeTime: false })
							.relative
					}
				</p>
			</div>

			<div className='flex gap-2'>
				{notification.href && (
					<Button
						to={notification.href}
						size='sm'
						mode='soft'
						appearance='neutral'
						onClick={() => {
							if (isNew) onStatusChange(notification.id, 'viewed')
						}}
						suffix={<Icon28LinkOutline width={16} height={16} />}
					>
						View
					</Button>
				)}

				<DropdownMenu>
					<DropdownMenu.Trigger>
						<Button
							size='sm'
							mode='ghost'
							appearance='neutral'
							prefix={<Icon28MoreHorizontal width={16} height={16} />}
							iconOnly
						/>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content className='w-44'>
						<DropdownMenu.Box>
							{isNew ? (
								<DropdownMenu.Item
									aria-label='Mark notification as viewed'
									onClick={() => onStatusChange(notification.id, 'viewed')}
									prefix={<Icon28DoneOutline width={18} height={18} />}
								>
									Mark as viewed
								</DropdownMenu.Item>
							) : (
								<DropdownMenu.Item
									aria-label='Mark notification as new'
									onClick={() => onStatusChange(notification.id, 'new')}
									prefix={<Icon28Notifications width={18} height={18} />}
								>
									Mark as new
								</DropdownMenu.Item>
							)}

							<DropdownMenu.Item
								aria-label='Delete notification'
								appearance='danger'
								onClick={() => onDelete(notification.id)}
								prefix={<Icon28DeleteOutline width={18} height={18} />}
							>
								Delete
							</DropdownMenu.Item>
						</DropdownMenu.Box>
					</DropdownMenu.Content>
				</DropdownMenu>
			</div>
		</div>
	)
}
