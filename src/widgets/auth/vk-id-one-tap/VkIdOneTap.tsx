'use client'

import { useEffect, useRef, useState } from 'react'
import * as VKID from '@vkid/sdk'

import { Badge } from 'ui/blocks'

export function VkIdOneTap() {
	const ref = useRef<HTMLDivElement>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!ref.current) return

		const appId = Number(process.env.NEXT_PUBLIC_VK_APP_ID)
		const redirectUrl = process.env.NEXT_PUBLIC_VK_REDIRECT_URL

		if (!Number.isFinite(appId) || !redirectUrl) {
			setError('VK ID is not configured')
			return
		}

		VKID.Config.init({
			app: appId,
			redirectUrl,
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
			.on(VKID.WidgetEvents.ERROR, (err: unknown) => {
				console.error(err)
				setError('VK ID widget error')
			})
			.on(
				VKID.OneTapInternalEvents.LOGIN_SUCCESS,
				async (payload: VKID.AuthResponse) => {
					try {
						setError(null)

						const tokens = await VKID.Auth.exchangeCode(
							payload.code,
							payload.device_id,
						)

						const res = await fetch('/api/auth/vk/session', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ accessToken: tokens.access_token }),
						})

						if (!res.ok) {
							const data = (await res.json().catch(() => null)) as {
								error?: string
							} | null
							setError(
								res.status === 403
									? 'Access denied'
									: data?.error || 'Login failed',
							)
							return
						}

						window.location.href = '/admin'
					} catch (err) {
						console.error(err)
						setError('Login failed')
					}
				},
			)
	}, [])

	return (
		<div className='relative w-full flex flex-col gap-2'>
			<div ref={ref} className='w-full' />

			{error && (
				<span className='absolute inset-0 flex items-center justify-center bg-background/80 pointer-events-none'>
					<Badge
						className='backdrop-blur-sm'
						role='alert'
						size='md'
						mode='soft'
						appearance='danger'
					>
						{error}
					</Badge>
				</span>
			)}
		</div>
	)
}
