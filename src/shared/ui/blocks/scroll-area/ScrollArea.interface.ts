import type { PartialOptions } from 'overlayscrollbars'
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-react'

export default interface ScrollAreaProps extends Omit<
	OverlayScrollbarsComponentProps,
	'options'
> {
	overflow?: 'y' | 'x' | 'both'
	autoHide?: 'never' | 'scroll' | 'leave' | 'move'
	options?: PartialOptions
}
