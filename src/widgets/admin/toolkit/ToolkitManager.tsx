'use client'

import Image from 'next/image'

import { Badge, Button, Separator } from 'ui/blocks'
import { DropdownMenu, Tooltip } from 'ui/floating'

import {
	Icon28HashtagOutline,
	Icon28MoreHorizontal,
	Icon28EditOutline,
	Icon28DeleteOutline,
	Icon28AddOutline,
	Icon28Chevrons2LeftOutline,
	Icon28ChevronUpOutline,
	Icon28MinusOutline,
} from '@vkontakte/icons'

import { TOOLKIT_ITEMS } from 'shared/data'

type ToolkitManagerProps = {
	items: typeof TOOLKIT_ITEMS
}

export function ToolkitManager({ items }: ToolkitManagerProps) {
	return (
		<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
			<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
				<div className='flex flex-1 flex-col gap-3'>
					<h2 className='text-3xl font-medium font-condensed tracking-tight'>
						*Title Area*
					</h2>
				</div>

				<div className='flex self-start gap-2'>
					<Tooltip text='Add toolkit'>
						<Button
							mode='secondary'
							appearance='neutral'
							prefix={<Icon28AddOutline width={18} height={18} />}
							iconOnly
						/>
					</Tooltip>
				</div>
			</div>

			{items.length === 0 ? (
				<p className='text-foreground-secondary'>No toolkit items yet</p>
			) : (
				<ul className='grid grid-cols-1 @md:grid-cols-2 gap-app'>
					{items.map(item => {
						return (
							<li
								key={item.id}
								className='flex flex-col bg-surface border border-separator rounded-surface overflow-hidden'
							>
								<div className='z-0 relative flex p-surface gap-surface'>
									<Image
										className='size-9'
										src={item.image.icon.url}
										alt={item.name}
										width={160}
										height={160}
									/>

									<div className='min-w-0 flex-1 flex flex-col gap-2'>
										<p className='text-xl text-balance font-semibold font-condensed tracking-tight'>
											{item.name}{' '}
											<Tooltip
												text={item.proficiency}
												triggerClassName='ml-1 align-baseline'
											>
												<Badge
													size='sm'
													mode='soft'
													appearance={
														item.proficiency === 'Core'
															? 'success'
															: item.proficiency === 'Frequent'
																? 'info'
																: item.proficiency === 'Occasional'
																	? 'neutral'
																	: 'neutral'
													}
													prefix={
														item.proficiency === 'Core' ? (
															<Icon28Chevrons2LeftOutline
																className='rotate-90'
																width={14}
																height={14}
															/>
														) : item.proficiency === 'Frequent' ? (
															<Icon28ChevronUpOutline width={14} height={14} />
														) : (
															item.proficiency === 'Occasional' && (
																<Icon28MinusOutline width={14} height={14} />
															)
														)
													}
												/>
											</Tooltip>{' '}
											<br />{' '}
											<span className='text-foreground-secondary'>
												{item.area}
											</span>
										</p>
									</div>

									<div className='flex gap-2'>
										<DropdownMenu>
											<DropdownMenu.Trigger>
												<Button
													size='sm'
													mode='ghost'
													appearance='neutral'
													prefix={
														<Icon28MoreHorizontal width={16} height={16} />
													}
													iconOnly
												/>
											</DropdownMenu.Trigger>

											<DropdownMenu.Content className='w-32'>
												<DropdownMenu.Box>
													<DropdownMenu.Item
														aria-label='Edit toolkit item'
														prefix={
															<Icon28EditOutline width={18} height={18} />
														}
													>
														Edit
													</DropdownMenu.Item>

													<DropdownMenu.Item
														aria-label='Delete toolkit item'
														appearance='danger'
														prefix={
															<Icon28DeleteOutline width={18} height={18} />
														}
													>
														Delete
													</DropdownMenu.Item>
												</DropdownMenu.Box>
											</DropdownMenu.Content>
										</DropdownMenu>
									</div>

									<span
										className='-z-1 absolute inset-0 size-full aspect-square animate-[fade-in_1000ms_ease-out] pointer-events-none'
										style={{
											background: `radial-gradient(ellipse 100% 100% at 0% 0%, color-mix(in srgb, ${item.color} 12%, transparent) 0%, transparent 100%)`,
										}}
									/>
								</div>

								<Separator />

								<div className='flex flex-1 flex-col p-surface gap-app'>
									<p className='flex-1 text-sm'>{item.summary}</p>

									{item.tags.length > 0 && (
										<span className='flex flex-wrap gap-1'>
											{item.tags.map(tag => (
												<Badge
													key={tag}
													size='sm'
													mode='soft'
													appearance='neutral'
													prefix={
														<Icon28HashtagOutline width={12} height={12} />
													}
												>
													{tag}
												</Badge>
											))}
										</span>
									)}
								</div>
							</li>
						)
					})}
				</ul>
			)}
		</section>
	)
}
