import type { HTMLMotionProps } from 'motion/react'
import type { VariantProps } from 'class-variance-authority'

import { backdropVariants } from './backdrop.variants'

type BackdropTone = NonNullable<VariantProps<typeof backdropVariants>['tone']>

export default interface BackdropProps extends Omit<
	HTMLMotionProps<'div'>,
	'children'
> {
	tone?: BackdropTone
	blur?: boolean
	blurAmount?: number
}
