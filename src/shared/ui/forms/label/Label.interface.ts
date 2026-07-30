export interface LabelProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'prefix'
> {
	prefix?: React.ReactNode
	suffix?: React.ReactNode
}
