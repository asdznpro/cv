import { NextResponse } from 'next/server'

import {
	createAdminSessionToken,
	setAdminSessionCookie,
	fetchVkUserInfo,
	isAdminVkId,
} from 'lib/auth'

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as { accessToken?: string }
		const accessToken = body.accessToken?.trim()

		if (!accessToken) {
			return NextResponse.json(
				{ error: 'accessToken is required' },
				{ status: 400 },
			)
		}

		const user = await fetchVkUserInfo(accessToken)

		if (!Number.isFinite(user.vkId) || !isAdminVkId(user.vkId)) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const token = await createAdminSessionToken({
			vkId: user.vkId,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar,
		})

		const response = NextResponse.json({ ok: true })
		setAdminSessionCookie(response, token)
		return response
	} catch (error) {
		console.error('[vk/session]', error)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}
