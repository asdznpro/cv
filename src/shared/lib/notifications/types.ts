export type NotificationStatus = 'new' | 'viewed'
export type NotificationSource = 'shortener'
export type NotificationKind = 'digest'

export const NOTIFICATIONS_PAGE_SIZE = 8

export type AdminNotification = {
	id: string
	source: NotificationSource
	kind: NotificationKind
	status: NotificationStatus
	createdAt: string
	title: string
	description?: string
	href?: string
}

export type AdminNotificationPage = {
	items: AdminNotification[]
	nextOffset: number
	hasMore: boolean
	unreadCount: number
	totalCount: number
}

export const EMPTY_NOTIFICATION_PAGE: AdminNotificationPage = {
	items: [],
	nextOffset: 0,
	hasMore: false,
	unreadCount: 0,
	totalCount: 0,
}

const STATUS_ORDER: Record<NotificationStatus, number> = {
	new: 0,
	viewed: 1,
}

export function sortNotifications(items: AdminNotification[]) {
	return [...items].sort((left, right) => {
		const byStatus = STATUS_ORDER[left.status] - STATUS_ORDER[right.status]
		if (byStatus !== 0) return byStatus

		return Date.parse(right.createdAt) - Date.parse(left.createdAt)
	})
}
