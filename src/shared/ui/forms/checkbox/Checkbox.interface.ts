export default interface CheckboxProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'type' | 'size'
> {
	/** Mixed state — set via DOM `indeterminate`, not a native React prop. */
	indeterminate?: boolean
}
