import type { VariantProps } from 'class-variance-authority'
import type { gaugeVariants } from './gauge.variants'

export default interface GaugeProps
	extends
		Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
		VariantProps<typeof gaugeVariants> {
	value?: number
	maxValue?: number
	strokeWidth?: number
	showValue?: boolean
	indeterminate?: boolean
	children?: React.ReactNode
}
