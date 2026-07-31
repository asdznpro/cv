'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'

import { useAdminShell, MIN } from '../shell'
import { Button, Kbd, Separator } from 'ui/blocks'

import {
	Icon28PollSquareOutline,
	Icon28ArticlesOutline,
	Icon28PictureStackOutline,
	Icon28SettingsOutline,
	Icon28WorkOutline,
	Icon28WrenchOutline,
	Icon28MoreHorizontal,
	Icon28ArrowLeftOutline,
	Icon28DocumentTextOutline,
	Icon28SearchOutline,
	Icon28ChevronRightOutline,
	Icon28ChainOutline,
} from '@vkontakte/icons'

const NAV_ITEMS = [
	{
		id: 'main',
		label: 'Main',
		items: [
			{
				href: '/admin',
				label: 'Overview',
				icon: <Icon28PollSquareOutline width={20} height={20} />,
			},
		],
	},

	{
		id: 'content',
		label: 'Content',
		items: [
			{
				href: '/admin/articles',
				label: 'Articles',
				icon: <Icon28ArticlesOutline width={20} height={20} />,
			},
			{
				href: '/admin/images',
				label: 'Images',
				icon: <Icon28PictureStackOutline width={20} height={20} />,
			},
		],
	},

	{
		id: 'resume',
		label: 'Resume',
		items: [
			{
				href: '/admin/experience',
				label: 'Experience',
				icon: <Icon28WorkOutline width={20} height={20} />,
			},
			{
				href: '/admin/companies',
				label: 'Companies',
				icon: <Icon28DocumentTextOutline width={20} height={20} />,
			},
			{
				href: '/admin/skills',
				label: 'Skills',
				icon: <Icon28WrenchOutline width={20} height={20} />,
			},
		],
	},

	{
		id: 'system',
		label: 'System',
		items: [
			{
				href: '/admin/shortener',
				label: 'URL Shortener',
				icon: <Icon28ChainOutline width={20} height={20} />,
			},
			{
				href: '/admin/settings',
				label: 'Settings',
				icon: <Icon28SettingsOutline width={20} height={20} />,
			},
		],
	},
]

export function Sidebar() {
	const pathname = usePathname()
	const { user, open, clipLayout, widthMv, dimOpacity, onResizeStart } =
		useAdminShell()

	const displayName =
		[user?.firstName, user?.lastName?.slice(0, 1) + '.']
			.filter(Boolean)
			.join(' ') || 'Admin'

	const activeHref = NAV_ITEMS.flatMap(section =>
		section.items.map(item => item.href),
	)
		.filter(href => pathname === href || pathname.startsWith(`${href}/`))
		.sort((a, b) => b.length - a.length)[0]

	const isActiveRoute = (href: string) => href === activeHref

	return (
		<>
			<motion.aside
				style={{ width: widthMv }}
				className='0relative sticky top-0 flex shrink-0 h-screen justify-end overflow-hidden bg-background'
			>
				<span
					aria-hidden
					className='pointer-events-none absolute inset-y-0 right-0 z-20 w-px bg-separator'
				/>

				<div
					className='flex h-full max-h-screen shrink-0 flex-col'
					style={{ width: clipLayout ? MIN : '100%' }}
				>
					<div className='flex flex-col p-2 gap-surface'>
						<Button
							to='/'
							size='lg'
							mode='ghost'
							appearance='neutral'
							prefix={<Icon28ArrowLeftOutline width={20} height={20} />}
							align='between'
						>
							Back to CV
						</Button>
					</div>

					<Separator />

					<div className='scrollbar overflow-y-auto h-full flex flex-col p-2 gap-2'>
						<Button
							size='lg'
							mode='soft'
							appearance='neutral'
							prefix={<Icon28SearchOutline width={20} height={20} />}
							suffix={
								<>
									<Kbd keys={['Shift', 'F']} radius='smooth' />
								</>
							}
							align='between'
						>
							Search
						</Button>

						{NAV_ITEMS.map(section => (
							<div key={section.id} className='flex flex-col gap-2'>
								<span className='px-4 pt-4 pb-2 text-xs text-foreground-secondary select-none'>
									{section.label}
								</span>

								{section.items.map(item => (
									<Button
										key={item.href}
										to={item.href}
										size='lg'
										mode={isActiveRoute(item.href) ? 'soft' : 'ghost'}
										appearance={isActiveRoute(item.href) ? 'accent' : 'neutral'}
										prefix={item.icon}
										suffix={
											isActiveRoute(item.href) && (
												<Icon28ChevronRightOutline width={20} height={20} />
											)
										}
										align='between'
									>
										{item.label}
									</Button>
								))}
							</div>
						))}
					</div>

					<Separator />

					<div className='flex flex-col p-surface gap-surface'>
						<div className='flex items-center gap-surface'>
							<div className='w-9 h-9 flex items-center justify-center bg-surface border border-separator rounded-full overflow-hidden 0outline-2 outline-offset-3 outline-accent'>
								{user?.avatar ? (
									<Image
										className='w-full h-full object-cover'
										src={user.avatar}
										alt={displayName}
										width={200}
										height={200}
									/>
								) : (
									<span className='text-sm font-medium text-foreground-tertiary'>
										{displayName.slice(0, 1)}
									</span>
								)}
							</div>

							<p className='flex-1 text-lg font-condensed font-medium truncate'>
								{displayName}
							</p>

							<Button
								mode='ghost'
								appearance='neutral'
								prefix={<Icon28MoreHorizontal width={18} height={18} />}
								iconOnly
							/>
						</div>
					</div>
				</div>

				<motion.div
					aria-hidden
					className='pointer-events-none absolute inset-0 z-10 bg-background'
					style={{ opacity: dimOpacity }}
				/>
			</motion.aside>

			<div
				role='separator'
				aria-orientation='vertical'
				aria-hidden={!open}
				onPointerDown={open ? onResizeStart : undefined}
				className='group relative w-0 shrink-0 cursor-col-resize'
				style={{ pointerEvents: open ? 'auto' : 'none' }}
			>
				<span className='absolute inset-y-0 -left-1 z-20 w-2' />
			</div>
		</>
	)
}
