import { FieldStatus } from '../field-status.type'

export interface FormItemProps extends React.AllHTMLAttributes<HTMLElement> {
	status?: FieldStatus
}
