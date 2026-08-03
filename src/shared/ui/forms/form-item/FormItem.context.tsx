'use client'

import { createContext, useContext } from 'react'

import type { FieldStatus } from '../field-status.type'

export type FormItemContextValue = {
	id: string
	status: FieldStatus
	required: boolean
	optional: boolean
	disabled: boolean
	captionId: string
	/** True while a Label is mounted inside this FormItem. */
	hasLabel: boolean
	setHasLabel: (hasLabel: boolean) => void
}

const FormItemContext = createContext<FormItemContextValue | null>(null)

export function FormItemProvider({
	value,
	children,
}: {
	value: FormItemContextValue
	children: React.ReactNode
}) {
	return (
		<FormItemContext.Provider value={value}>{children}</FormItemContext.Provider>
	)
}

export function useFormItem() {
	return useContext(FormItemContext)
}
