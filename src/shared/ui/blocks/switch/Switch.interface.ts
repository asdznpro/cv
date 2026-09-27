export default interface SwitchProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
	appearance?: 'accent' | 'neutral' | 'danger' | 'success' | undefined

	/** Icon inside the thumb. Shown in both states unless `checkedIcon` is set. */
	icon?: React.ReactNode
	/** Replaces `icon` while the switch is on. */
	checkedIcon?: React.ReactNode
}
