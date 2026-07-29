import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from './constants'

export type AdminSession = {
	vkId: number
	firstName?: string
	lastName?: string
	avatar?: string
}

function getSecret() {
	const secret = process.env.AUTH_SECRET
	if (!secret) {
		throw new Error('AUTH_SECRET is not set')
	}
	return new TextEncoder().encode(secret)
}

export async function createAdminSessionToken(session: AdminSession) {
	return new SignJWT({
		vkId: session.vkId,
		firstName: session.firstName,
		lastName: session.lastName,
		avatar: session.avatar,
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(`${ADMIN_SESSION_MAX_AGE}s`)
		.sign(getSecret())
}

export async function verifyAdminSessionToken(
	token: string,
): Promise<AdminSession | null> {
	try {
		const { payload } = await jwtVerify(token, getSecret())
		const vkId = Number(payload.vkId)
		if (!Number.isFinite(vkId)) return null

		return {
			vkId,
			firstName:
				typeof payload.firstName === 'string' ? payload.firstName : undefined,
			lastName:
				typeof payload.lastName === 'string' ? payload.lastName : undefined,
			avatar: typeof payload.avatar === 'string' ? payload.avatar : undefined,
		}
	} catch {
		return null
	}
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
	response.cookies.set(ADMIN_SESSION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: ADMIN_SESSION_MAX_AGE,
	})
}

export function clearAdminSessionCookie(response: NextResponse) {
	response.cookies.set(ADMIN_SESSION_COOKIE, '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 0,
	})
}

export async function getAdminSession(): Promise<AdminSession | null> {
	const jar = await cookies()
	const token = jar.get(ADMIN_SESSION_COOKIE)?.value
	if (!token) return null
	return verifyAdminSessionToken(token)
}

export async function requireAdminSession(): Promise<AdminSession> {
	const session = await getAdminSession()
	if (!session) {
		throw new Error('Unauthorized')
	}
	return session
}
