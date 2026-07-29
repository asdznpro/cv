'use client'

import { useEffect, useRef } from 'react'
import * as VKID from '@vkid/sdk'

export function VkIdOneTap() {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!ref.current) return

		VKID.Config.init({
			app: Number(process.env.NEXT_PUBLIC_VK_APP_ID),
			redirectUrl: process.env.NEXT_PUBLIC_VK_REDIRECT_URL!,
			responseMode: VKID.ConfigResponseMode.Callback,
			scope: '',
		})

		const oneTap = new VKID.OneTap()

		oneTap
			.render({
				container: ref.current,
				scheme: VKID.Scheme.DARK,
				lang: VKID.Languages.ENG,
				showAlternativeLogin: true,
			})
			.on(VKID.WidgetEvents.ERROR, console.error)
			.on(
				VKID.OneTapInternalEvents.LOGIN_SUCCESS,
				async (payload: VKID.AuthResponse) => {
					const res = await fetch('/api/auth/vk/session', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							code: payload.code,
							deviceId: payload.device_id,
						}),
					})
					if (res.ok) window.location.href = '/admin'
				},
			)
	}, [])

	return <div ref={ref} className='w-full' />
}
