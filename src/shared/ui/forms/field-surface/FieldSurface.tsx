import { twMerge } from 'tailwind-merge'

import {
	fieldSurfaceBackdropVariants,
	fieldSurfaceVariants,
} from './field-surface.variants'
import type FieldSurfaceProps from './FieldSurface.interface'

export function FieldSurface(props: FieldSurfaceProps) {
	const { mode, status, radius, disabled = false, className } = props

	return (
		<span
			aria-hidden
			className={twMerge(
				fieldSurfaceBackdropVariants(),
				fieldSurfaceVariants({ mode, status, radius, disabled }),
				className,
			)}
		/>
	)
}
