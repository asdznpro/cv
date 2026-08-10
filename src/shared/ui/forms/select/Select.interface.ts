import type { FieldStatus } from '../field-status.type'

export type SelectOption = {
	value: string
	label: string
	disabled?: boolean
}

export default interface SelectProps {
	options: SelectOption[]
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
}
