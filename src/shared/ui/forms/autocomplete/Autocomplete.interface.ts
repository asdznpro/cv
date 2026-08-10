import type { FieldOption } from '../_components/option-list'
import type { FieldStatus } from '../field-status.type'

export default interface AutocompleteProps {
	options: FieldOption[]
	value?: string[]
	defaultValue?: string[]
	onValueChange?: (value: string[]) => void
	placeholder?: string
	disabled?: boolean
	required?: boolean
	id?: string
	name?: string
	className?: string
	mode?: 'secondary' | 'outline'
	status?: FieldStatus
	size?: 'lg' | 'md'
	radius?: 'smooth' | 'none'
	emptyText?: string
}
