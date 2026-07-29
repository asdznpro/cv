import { LinkProps } from 'next/link'

export default interface ButtonProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'prefix' | 'size'
> {
	mode?: 'primary' | 'soft' | 'secondary' | 'outline' | 'ghost' | undefined
	appearance?: 'accent' | 'neutral' | 'danger' | 'success' | undefined
	size?: 'lg' | 'md' | 'sm' | undefined
	align?: 'center' | 'spread' | 'between'
	radius?: 'smooth' | 'rounded' | 'none' | undefined

	as?: 'button' | 'span' | undefined
	iconOnly?: boolean | undefined

	prefix?: React.ReactNode
	suffix?: React.ReactNode

	to?: LinkProps['href']
	target?: React.HTMLAttributeAnchorTarget | undefined
}
