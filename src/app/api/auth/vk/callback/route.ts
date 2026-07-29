import { NextResponse } from 'next/server'

/**
 * Redirect URL registered in VK ID cabinet.
 * OneTap uses Callback mode, so this route is a safe landing stub.
 */
export async function GET(request: Request) {
	const url = new URL(request.url)
	return NextResponse.redirect(new URL('/admin/login', url.origin))
}
