export default interface TextareaProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'prefix' | 'size'
> {
	mode?: 'secondary' | 'outline' | undefined
	status?: 'default' | 'error' | 'valid' | undefined
	size?: 'lg' | 'md' | undefined

	radius?: 'smooth' | 'none' | undefined
	resize?: 'vertical' | 'none'
}
