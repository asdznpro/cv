export interface LabelProps extends Omit<
	React.LabelHTMLAttributes<HTMLLabelElement>,
	'prefix'
> {
	prefix?: React.ReactNode
	suffix?: React.ReactNode
	optional?: boolean
	required?: boolean
}
