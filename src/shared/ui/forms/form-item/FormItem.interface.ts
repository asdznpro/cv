import type { FieldStatus } from '../field-status.type'

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
	status?: FieldStatus
	required?: boolean
	optional?: boolean
}
