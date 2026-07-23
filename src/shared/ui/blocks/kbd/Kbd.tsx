import { twMerge } from 'tailwind-merge'

import { kbdVariants } from './kbd.variants'
import type KbdProps from './Kbd.interface'

export function Kbd(props: KbdProps) {
	const { children, size, radius, ...restProps } = props

	return (
		<kbd
			{...restProps}
			className={twMerge('root', kbdVariants({ size, radius }))}
		>
			{children}
		</kbd>
	)
}
