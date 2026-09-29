'use client'

import { useEffect, useRef, useState } from 'react'
import * as VKID from '@vkid/sdk'

import { Chip } from 'ui/blocks'

export function VkIdOneTap() {
	const ref = useRef<HTMLDivElement>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const container = ref.current
		if (!container) return

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

		let oneTap: VKID.OneTap | null = null
		let cancelled = false

		// Dev Strict Mode runs the effect, cleans it up, then runs it again
		// in the same turn. The SDK paints the button on a timeout, so a
		// synchronous render+close leaves a second button behind.
		const timer = window.setTimeout(() => {
			if (cancelled || !container.isConnected) return

			container.replaceChildren()
			oneTap = new VKID.OneTap()

			oneTap
				.render({
					container,
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
		}, 0)

		return () => {
			cancelled = true
			window.clearTimeout(timer)
			oneTap?.close()
		}
	}, [])

	return (
		<div className='relative w-full flex flex-col gap-2'>
			<div ref={ref} className='w-full' />

			{error && (
				<span className='absolute inset-0 flex items-center justify-center bg-background/80 pointer-events-none'>
					<Chip
						className='backdrop-blur-sm'
						role='alert'
						size='md'
						mode='soft'
						appearance='danger'
					>
						{error}
					</Chip>
				</span>
			)}
		</div>
	)
}
