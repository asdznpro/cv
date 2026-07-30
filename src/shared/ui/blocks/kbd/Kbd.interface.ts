export default interface KbdProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'size'
> {
	keys?: string[]
	variant?: 'dark' | 'neutral'
	size?: 'md' | 'sm'
	radius?: 'smooth' | 'rounded' | 'none'
}
