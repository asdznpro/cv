'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'

import {
	formatToolkitArea,
	formatToolkitProficiency,
	formatToolkitTag,
	type ToolkitItem,
} from 'lib/toolkit'

import { Badge, Separator } from 'ui/blocks'
import { Tooltip } from 'ui/floating'

import {
	Icon28HashtagOutline,
	Icon28Chevrons2LeftOutline,
	Icon28ChevronUpOutline,
	Icon28MinusOutline,
} from '@vkontakte/icons'

type ToolkitCardProps = {
	item: ToolkitItem
	action?: ReactNode
}

export function ToolkitCard({ item, action }: ToolkitCardProps) {
	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface overflow-hidden'>
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
							text={formatToolkitProficiency(item.proficiency)}
							triggerClassName='ml-1 align-baseline'
						>
							<Badge
								size='sm'
								mode='soft'
								appearance={
									item.proficiency === 'core'
										? 'success'
										: item.proficiency === 'frequent'
											? 'info'
											: 'neutral'
								}
								prefix={
									item.proficiency === 'core' ? (
										<Icon28Chevrons2LeftOutline
											className='rotate-90'
											width={14}
											height={14}
										/>
									) : item.proficiency === 'frequent' ? (
										<Icon28ChevronUpOutline width={14} height={14} />
									) : (
										item.proficiency === 'occasional' && (
											<Icon28MinusOutline width={14} height={14} />
										)
									)
								}
							/>
						</Tooltip>{' '}
						<br />{' '}
						<span className='text-foreground-secondary'>
							{formatToolkitArea(item.area)}
						</span>
					</p>
				</div>

				{action}

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
								prefix={<Icon28HashtagOutline width={12} height={12} />}
							>
								{formatToolkitTag(tag)}
							</Badge>
						))}
					</span>
				)}
			</div>
		</div>
	)
}
