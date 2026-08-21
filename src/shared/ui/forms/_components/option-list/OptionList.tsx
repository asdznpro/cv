'use client'

import { twMerge } from 'tailwind-merge'
import { Icon28DoneOutline } from '@vkontakte/icons'

import { Button, ScrollArea } from 'ui/blocks'

import { fieldSurfaceVariants } from '../field-surface'
import type { OptionListProps } from './OptionList.interface'

export function OptionList({
	options,
	value,
	activeIndex,
	listRef,
	getItemProps,
	onSelect,
	mode,
	radius,
	emptyText = 'No results',
	style,
	className,
}: OptionListProps) {
	return (
		<div
			style={style}
			className={twMerge(
				fieldSurfaceVariants({
					mode,
					status: 'default',
					radius,
					disabled: false,
				}),
				'rounded-xl shadow-xl shadow-background/40',
				className,
			)}
		>
			<ScrollArea className='max-h-48'>
				<div className='flex flex-col p-1.5 gap-1'>
					{options.length === 0 ? (
						<span className='p-2 text-sm text-foreground-secondary text-center select-none'>
							{emptyText}
						</span>
					) : (
						options.map((option, index) => {
							const isSelected = Array.isArray(value)
								? value.includes(option.value)
								: option.value === value
							const isActive = index === activeIndex

							return (
								<Button
									{...getItemProps({
										onClick() {
											if (option.disabled) return
											onSelect(option.value)
										},
									})}
									key={option.value}
									ref={node => {
										listRef.current[index] = node
									}}
									type='button'
									role='option'
									tabIndex={isActive ? 0 : -1}
									aria-selected={isSelected}
									disabled={option.disabled}
									mode='ghost'
									appearance='neutral'
									align='between'
									className='w-full scroll-m-4 appearance-none'
									suffix={
										isSelected ? (
											<Icon28DoneOutline width={16} height={16} />
										) : undefined
									}
								>
									{option.label}
								</Button>
							)
						})
					)}
				</div>
			</ScrollArea>
		</div>
	)
}
