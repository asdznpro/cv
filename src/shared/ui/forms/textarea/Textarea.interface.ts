import { FieldStatus } from '../field-status.type'

export default interface TextareaProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'prefix' | 'size'
> {
	mode?: 'secondary' | 'outline' | undefined
	status?: FieldStatus
	size?: 'lg' | 'md' | undefined

	radius?: 'smooth' | 'none' | undefined
	resize?: 'vertical' | 'none'
}
