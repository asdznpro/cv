export default interface CounterProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'size'
> {
	variant?: 'accent' | 'danger' | 'neutral' | 'inverse' | undefined
	size?: 'lg' | 'md' | 'sm' | undefined
}
