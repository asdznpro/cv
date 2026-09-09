import { twMerge } from 'tailwind-merge'

import { separatorVariants } from './separator.variants'
import type SeparatorProps from './Separator.interface'

export function Separator(props: SeparatorProps) {
	const { orientation, className, ...restProps } = props

	if (orientation === 'vertical') {
		return (
			<div className='self-stretch flex items-center'>
				<div
					{...restProps}
					className={twMerge(
						'root',
						separatorVariants({ orientation }),
						className,
					)}
				/>
			</div>
		)
	}

	return (
		<div
			{...restProps}
			className={twMerge('root', separatorVariants({ orientation }), className)}
		/>
	)
}
