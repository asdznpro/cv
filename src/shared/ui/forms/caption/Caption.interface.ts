import { FieldStatus } from '../field-status.type'

export interface CaptionProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'prefix'
> {
	status?: FieldStatus
	prefix?: React.ReactNode
}
