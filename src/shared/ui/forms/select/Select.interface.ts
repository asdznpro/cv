import type { FieldOption } from '../_components/option-list'
import type { FieldStatus } from '../field-status.type'

export type { FieldOption }

/** @deprecated Prefer FieldOption — kept for Select API compatibility. */
export type SelectOption = FieldOption

export default interface SelectProps {
	options: FieldOption[]
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	placeholder?: string
	disabled?: boolean
	required?: boolean
	id?: string
	name?: string
	className?: string
	mode?: 'secondary' | 'outline'
	status?: FieldStatus
	size?: 'lg' | 'md'
	radius?: 'smooth' | 'rounded' | 'none'
	prefix?: React.ReactNode
}
