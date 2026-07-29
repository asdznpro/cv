import { NextRequest, NextResponse } from 'next/server'

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from 'lib/auth'

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const isLogin = pathname === '/admin/login'
	const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
	const session = token ? await verifyAdminSessionToken(token) : null

	if (!session && !isLogin) {
		const loginUrl = request.nextUrl.clone()
		loginUrl.pathname = '/admin/login'
		loginUrl.search = ''
		return NextResponse.redirect(loginUrl)
	}

	if (session && isLogin) {
		const adminUrl = request.nextUrl.clone()
		adminUrl.pathname = '/admin'
		adminUrl.search = ''
		return NextResponse.redirect(adminUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/admin', '/admin/:path*'],
}
