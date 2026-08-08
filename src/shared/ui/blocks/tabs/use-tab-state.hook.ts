'use client'

import { useState } from 'react'

const useTabState = (initialIndex: number = 0) => {
	const [tabState, setTabState] = useState<number>(initialIndex)

	const handleTabSelect = (index: number) => {
		setTabState(index)
	}

	return { tabState, handleTabSelect }
}

export { useTabState }
