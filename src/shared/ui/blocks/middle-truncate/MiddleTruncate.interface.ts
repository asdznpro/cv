export default interface MiddleTruncateProps extends Omit<
	React.HTMLAttributes<HTMLSpanElement>,
	'children'
> {
	value: string
}
