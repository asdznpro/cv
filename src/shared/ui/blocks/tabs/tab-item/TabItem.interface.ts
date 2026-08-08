export default interface TabItemProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'prefix'
> {
	selected?: boolean

	prefix?: React.ReactNode
	suffix?: React.ReactNode
}
