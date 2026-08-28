'use client'

import { twMerge } from 'tailwind-merge'

import { Badge, Kbd, ScrollArea, Separator } from 'ui/blocks'
import {
	Icon20ArrowTurnRightOutline,
	Icon28PollSquareOutline,
} from '@vkontakte/icons'

import { NAV_ITEMS } from 'widgets/admin'

type CommandMenuProps = {
	onClose?: () => void
}

export function CommandMenu(props: CommandMenuProps) {
	const { onClose } = props

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface overflow-hidden'>
			<div className='flex flex-col p-2 gap-2'>
				<div className='flex flex-1 items-center gap-3'>
					<input
						autoFocus
						id='search'
						type='text'
						placeholder='What do you need?'
						className={twMerge(
							'flex-1 p-2 text-xl font-medium font-condensed tracking-tight rounded-md appearance-none outline-none',
							'placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary',
							'disabled:text-foreground-secondary disabled:cursor-not-allowed',
						)}
					/>
				</div>
			</div>

			<Separator />

			<ScrollArea className='max-h-92'>
				<div className='flex flex-col p-2 gap-2'>
					{NAV_ITEMS.map(section => (
						<div key={section.id} className='flex flex-col gap-2'>
							<span className='px-surface py-1 text-xs text-foreground-secondary select-none'>
								{section.label}
							</span>

							{section.items.map(item => (
								<button
									key={item.href}
									className={twMerge(
										'group flex flex-1 p-surface gap-surface scroll-m-12',
										'rounded-md bg-surface-secondary/strong hover:bg-surface-secondary focus-visible:bg-surface-secondary active:scale-98',
										'transition-all duration-100 ease-in',
										'select-none cursor-pointer focus-ring-base focus-ring-visible',
									)}
								>
									<Badge
										mode='soft'
										appearance='neutral'
										prefix={<Icon28PollSquareOutline width={16} height={16} />}
									/>

									<Badge
										className='my-auto order-last scale-0 group-hover:scale-100 group-focus-visible:scale-100'
										mode='ghost'
										appearance='neutral'
										prefix={
											<Icon20ArrowTurnRightOutline
												className='-scale-x-100'
												width={16}
												height={16}
											/>
										}
									/>

									<div className='flex flex-1 flex-col gap-2 text-left'>
										<h3 className='text-lg font-medium font-condensed tracking-tight'>
											<span className='text-foreground-secondary'>Admin</span>{' '}
											<span className='text-foreground-secondary'>/</span>{' '}
											{item.label}
										</h3>

										<p className='text-sm text-foreground-secondary line-clamp-1'>
											If your hardware supports this feature we we automatically
											lay of the processing to the hardware. Otherwise our built
											in software algorithm is used.
										</p>
									</div>
								</button>
							))}
						</div>
					))}
				</div>
			</ScrollArea>

			<Separator />

			<div className='flex p-surface gap-surface'>
				<span className='flex items-center gap-2'>
					<Kbd size='sm' keys={['↑', '↓']} />
					<span className='text-xs text-foreground-secondary'>to navigate</span>
				</span>

				<span className='flex items-center gap-2'>
					<Kbd size='sm' keys={['↵']} />
					<span className='text-xs text-foreground-secondary'>to select</span>
				</span>

				<span className='flex items-center gap-2'>
					<Kbd size='sm' keys={['Esc']} />
					<span className='text-xs text-foreground-secondary'>to close</span>
				</span>
			</div>
		</div>
	)
}
