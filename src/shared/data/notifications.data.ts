export type NotificationStatus = 'new' | 'viewed'
export type NotificationSource = 'shortener'

export type AdminNotification = {
	id: string
	source: NotificationSource
	status: NotificationStatus
	createdAt: string
	title: string
	description?: string
	href?: string
}

const STATUS_ORDER: Record<NotificationStatus, number> = {
	new: 0,
	viewed: 1,
}

export const NOTIFICATIONS_DATA: AdminNotification[] = [
	{
		id: 'ntf_digest_2026-08-28',
		source: 'shortener',
		status: 'new',
		createdAt: '2026-08-28T06:00:00.000Z',
		title: '47 clicks on Aug 27',
		href: '/admin/shortener',
	},
	{
		id: 'ntf_digest_2026-08-26',
		source: 'shortener',
		status: 'new',
		createdAt: '2026-08-26T06:00:00.000Z',
		title: '12 clicks on Aug 26',
		href: '/admin/shortener',
	},
	{
		id: 'ntf_digest_2026-08-27',
		source: 'shortener',
		status: 'viewed',
		createdAt: '2026-08-27T06:00:00.000Z',
		title: '9 clicks on Aug 27',
		href: '/admin/shortener',
	},
	{
		id: 'ntf_digest_2026-08-25',
		source: 'shortener',
		status: 'viewed',
		createdAt: '2026-08-25T06:00:00.000Z',
		title: '31 clicks on Aug 25',
		href: '/admin/shortener',
	},
	{
		id: 'ntf_digest_2026-08-24',
		source: 'shortener',
		status: 'viewed',
		createdAt: '2026-08-24T06:00:00.000Z',
		title: '4 clicks on Aug 24',
		href: '/admin/shortener',
	},
]

export function sortNotifications(items: AdminNotification[]) {
	return [...items].sort((left, right) => {
		const byStatus = STATUS_ORDER[left.status] - STATUS_ORDER[right.status]
		if (byStatus !== 0) return byStatus

		return Date.parse(right.createdAt) - Date.parse(left.createdAt)
	})
}
