import { twMerge } from 'tailwind-merge'

import type { LabelProps } from './Label.interface'

export function Label(props: LabelProps) {
	const { children, prefix, suffix, className, ...restProps } = props

	return (
		<div
			{...restProps}
			className={twMerge(
				'root flex items-center gap-1.5',
				'text-sm font-condensed font-medium tracking-tight',
				className,
			)}
		>
			{prefix && (
				<span className='prefix text-foreground-secondary'>{prefix}</span>
			)}

			<span className='min-w-0 flex gap-1'>
				<span className='truncate'>{children}</span>

				<span className='text-foreground-secondary select-none'>
					(optional)
				</span>

				{restProps.required && (
					<span className='text-danger select-none'>*</span>
				)}
			</span>

			{suffix && (
				<span className='suffix ml-auto text-foreground-secondary'>
					{suffix}
				</span>
			)}
		</div>
	)
}
