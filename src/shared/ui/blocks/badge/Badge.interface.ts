import { LinkProps } from 'next/link'

export default interface BadgeProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'prefix' | 'size'
> {
	mode?: 'primary' | 'soft' | 'secondary' | 'outline' | 'ghost' | undefined
	appearance?:
		| 'accent'
		| 'neutral'
		| 'danger'
		| 'success'
		| 'info'
		| 'warning'
		| undefined

	size?: 'lg' | 'md' | 'sm' | undefined
	radius?: 'smooth' | 'rounded' | 'none' | undefined

	prefix?: React.ReactNode
	suffix?: React.ReactNode

	to?: LinkProps['href']
	target?: React.HTMLAttributeAnchorTarget | undefined
}
