import { FieldStatus } from '../field-status.type'

export default interface InputProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'prefix' | 'size'
> {
	mode?: 'secondary' | 'outline' | undefined
	status?: FieldStatus
	size?: 'lg' | 'md' | undefined

	radius?: 'smooth' | 'rounded' | 'none' | undefined

	prefix?: React.ReactNode
	suffix?: React.ReactNode
}
