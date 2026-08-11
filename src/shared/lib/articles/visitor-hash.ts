import 'server-only'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'

/** Same idea as short-link worker: sha256(salt:ip:ua). */
export async function getVisitorHash() {
	const h = await headers()
	const ip =
		h.get('cf-connecting-ip') ||
		h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		h.get('x-real-ip') ||
		'unknown'
	const ua = h.get('user-agent') || ''
	const salt =
		process.env.VISITOR_HASH_SALT || process.env.AUTH_SECRET || 'cv-visitor'

	return createHash('sha256').update(`${salt}:${ip}:${ua}`).digest('hex')
}
