type VkUserInfoResponse = {
	user?: {
		user_id?: string | number
		first_name?: string
		last_name?: string
		avatar?: string
	}
	error?: string
	error_description?: string
}

export async function fetchVkUserInfo(accessToken: string) {
	const appId = process.env.NEXT_PUBLIC_VK_APP_ID
	if (!appId) {
		throw new Error('NEXT_PUBLIC_VK_APP_ID is not set')
	}

	const url = new URL('https://id.vk.ru/oauth2/user_info')
	url.searchParams.set('client_id', appId)

	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ access_token: accessToken }),
		cache: 'no-store',
	})

	const data = (await res.json()) as VkUserInfoResponse

	if (!res.ok || data.error || !data.user?.user_id) {
		throw new Error(
			data.error_description || data.error || 'VK user_info failed',
		)
	}

	return {
		vkId: Number(data.user.user_id),
		firstName: data.user.first_name,
		lastName: data.user.last_name,
		avatar: data.user.avatar,
	}
}
