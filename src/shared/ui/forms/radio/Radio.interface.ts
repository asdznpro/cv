export default interface RadioProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'type' | 'size'
> {}
