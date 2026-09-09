'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminSession } from 'lib/auth'
import { createAdminClient } from 'lib/supabase/admin'

import {
	sortNotifications,
	type AdminNotification,
	type NotificationKind,
	type NotificationSource,
	type NotificationStatus,
} from './types'

export type ActionResult = { ok: true } | { ok: false; error: string }

const NOTIFICATION_SELECT =
	'id, source, kind, status, title, description, href, created_at'

async function assertAdmin() {
	try {
		await requireAdminSession()
	} catch {
		return false
	}
	return true
}

function revalidateNotifications() {
	revalidatePath('/admin', 'layout')
}

function isNotificationStatus(value: unknown): value is NotificationStatus {
	return value === 'new' || value === 'viewed'
}

function isNotificationSource(value: unknown): value is NotificationSource {
	return value === 'shortener'
}

function isNotificationKind(value: unknown): value is NotificationKind {
	return value === 'digest'
}

function mapNotification(row: Record<string, unknown>): AdminNotification {
	return {
		id: String(row.id),
		source: isNotificationSource(row.source) ? row.source : 'shortener',
		kind: isNotificationKind(row.kind) ? row.kind : 'digest',
		status: isNotificationStatus(row.status) ? row.status : 'new',
		createdAt: String(row.created_at),
		title: String(row.title),
		description:
			typeof row.description === 'string' && row.description
				? row.description
				: undefined,
		href: typeof row.href === 'string' && row.href ? row.href : undefined,
	}
}

export async function listAdminNotifications(): Promise<AdminNotification[]> {
	if (!(await assertAdmin())) {
		return []
	}

	const supabase = createAdminClient()
	const { error: digestError } = await supabase.rpc(
		'ensure_shortener_daily_digests',
		{ p_days: 30 },
	)

	if (digestError) {
		console.error('[ensure_shortener_daily_digests]', digestError.message)
	}

	const { data, error } = await supabase
		.from('admin_notifications')
		.select(NOTIFICATION_SELECT)
		.order('created_at', { ascending: false })
		.limit(50)

	if (error) {
		throw new Error(error.message)
	}

	return sortNotifications(
		(data ?? []).map(row => mapNotification(row as Record<string, unknown>)),
	)
}

export async function updateAdminNotificationStatus(
	id: string,
	status: NotificationStatus,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id || !isNotificationStatus(status)) {
		return { ok: false, error: 'Invalid notification' }
	}

	const supabase = createAdminClient()
	const { error } = await supabase
		.from('admin_notifications')
		.update({ status })
		.eq('id', id)

	if (error) {
		return { ok: false, error: error.message }
	}

	revalidateNotifications()
	return { ok: true }
}

export async function deleteAdminNotification(
	id: string,
): Promise<ActionResult> {
	if (!(await assertAdmin())) {
		return { ok: false, error: 'Unauthorized' }
	}

	if (!id) {
		return { ok: false, error: 'Invalid notification' }
	}

	const supabase = createAdminClient()
	const { error } = await supabase
		.from('admin_notifications')
		.delete()
		.eq('id', id)

	if (error) {
		return { ok: false, error: error.message }
	}

	revalidateNotifications()
	return { ok: true }
}
