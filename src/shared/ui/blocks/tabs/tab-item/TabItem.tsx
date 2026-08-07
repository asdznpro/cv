import { twMerge } from 'tailwind-merge'

import type TabItemProps from './TabItem.interface'

export function TabItem(props: TabItemProps) {
	const { children, selected, prefix, suffix, className, ...restProps } = props

	return (
		<button
			{...restProps}
			type='button'
			className={twMerge(
				'group relative inline-flex items-center justify-center shrink-0',
				'w-fit min-w-8 h-7 min-h-7 px-2 text-sm rounded',
				'font-condensed font-medium select-none',
				'transition-all duration-100 ease-in',
				'cursor-pointer focus-ring-base focus-ring-visible',
				'active:scale-98 disabled:cursor-not-allowed disabled:text-foreground-tertiary disabled:bg-foreground-tertiary/10 disabled:active:scale-100',
				selected
					? 'text-foreground bg-foreground-tertiary/20'
					: 'text-foreground-secondary enabled:hover:bg-foreground-tertiary/20 enabled:focus-visible:bg-foreground-tertiary/20',
				className,
			)}
		>
			<span className='flex items-center justify-center gap-1'>
				{prefix && <span className='prefix flex gap-0.5'>{prefix}</span>}

				<span className='truncate'>{children}</span>

				{suffix && <span className='suffix flex gap-0.5'>{suffix}</span>}
			</span>
		</button>
	)
}
