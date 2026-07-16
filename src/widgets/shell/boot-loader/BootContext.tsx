'use client'

import {
	createContext,
	useContext,
	useEffect,
	useState,
	startTransition,
} from 'react'

export const BOOT_DURATION_MS = 3000

const STORAGE_KEY = 'cv-boot-done'

const BootContext = createContext<{
	bootVisible: boolean
}>({ bootVisible: true })

export function BootProvider({ children }: { children: React.ReactNode }) {
	const [bootVisible, setBootVisible] = useState(true)

	useEffect(() => {
		if (sessionStorage.getItem(STORAGE_KEY)) {
			setBootVisible(false)
			return
		}

		const finish = () => {
			sessionStorage.setItem(STORAGE_KEY, '1')
			startTransition(() => {
				setBootVisible(false)
			})
		}

		const id = window.setTimeout(finish, BOOT_DURATION_MS)
		return () => window.clearTimeout(id)
	}, [])

	return (
		<BootContext.Provider value={{ bootVisible }}>
			{children}
		</BootContext.Provider>
	)
}

export function useBoot() {
	return useContext(BootContext)
}
