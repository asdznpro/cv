import { twMerge } from 'tailwind-merge'

import { kbdGroupRadiusClass, kbdVariants } from './kbd.variants'
import type KbdProps from './Kbd.interface'

export function Kbd(props: KbdProps) {
	const {
		keys,
		variant,
		size,
		radius: radiusProp,
		className,
		...restProps
	} = props
	const list = keys ?? []
	const radius = radiusProp ?? 'smooth'
	const resolvedSize = size ?? 'md'

	return (
		<span {...restProps} className={twMerge('root flex gap-0.5', className)}>
			{list.map((key, index) => (
				<kbd
					key={`${key}-${index}`}
					className={twMerge(
						kbdVariants({ variant, size: resolvedSize, radius }),
						radius === 'rounded' &&
							kbdGroupRadiusClass(resolvedSize, index, list.length),
					)}
				>
					{key}
				</kbd>
			))}
		</span>
	)
}
