import type { FieldStatus } from '../field-status.type'

export interface FormItemProps extends Omit<
	React.HTMLAttributes<HTMLDivElement>,
	'id'
> {
	status?: FieldStatus
	required?: boolean
	optional?: boolean
	disabled?: boolean
	id?: string
}
