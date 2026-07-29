export default interface KbdProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'size'
> {
	size?: 'md' | 'sm' | undefined
	radius?: 'smooth' | 'rounded' | 'none' | undefined
}
