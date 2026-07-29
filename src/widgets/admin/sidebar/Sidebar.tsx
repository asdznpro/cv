'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'

import { useAdminShell, MIN } from '../shell'
import { Button, Separator } from 'ui/blocks'
import { Logo } from 'ui/brand'

import {
	Icon28PollSquareOutline,
	Icon28ArticlesOutline,
	Icon28ChevronRightCircle,
	Icon28PictureStackOutline,
	Icon28SettingsOutline,
	Icon28WorkOutline,
	Icon28WrenchOutline,
	Icon28MoreHorizontal,
	Icon28ArrowLeftOutline,
} from '@vkontakte/icons'

const NAV_ITEMS = [
	{
		href: '/admin',
		label: 'Overview',
		icon: <Icon28PollSquareOutline width={20} height={20} />,
	},
	{
		href: '/admin/articles',
		label: 'Articles',
		icon: <Icon28ArticlesOutline width={20} height={20} />,
	},
	{
		href: '/admin/experience',
		label: 'Experience',
		icon: <Icon28WorkOutline width={20} height={20} />,
	},
	{
		href: '/admin/skills',
		label: 'Skills',
		icon: <Icon28WrenchOutline width={20} height={20} />,
	},
	{
		href: '/admin/images',
		label: 'Images',
		icon: <Icon28PictureStackOutline width={20} height={20} />,
	},
	{
		href: '/admin/settings',
		label: 'Settings',
		icon: <Icon28SettingsOutline width={20} height={20} />,
	},
]

export function Sidebar() {
	const pathname = usePathname()
	const { open, clipLayout, widthMv, dimOpacity, onResizeStart } =
		useAdminShell()

	const activeHref = NAV_ITEMS.map(item => item.href)
		.filter(href => pathname === href || pathname.startsWith(`${href}/`))
		.sort((a, b) => b.length - a.length)[0]

	const isActiveRoute = (href: string) => href === activeHref

	return (
		<>
			<motion.aside
				style={{ width: widthMv }}
				className='relative sticky top-0 flex shrink-0 h-screen justify-end overflow-hidden'
			>
				<span
					aria-hidden
					className='pointer-events-none absolute inset-y-0 right-0 z-20 w-px bg-separator'
				/>

				<div
					className='flex h-full max-h-screen shrink-0 flex-col'
					style={{ width: clipLayout ? MIN : '100%' }}
				>
					<div className='flex flex-col p-surface gap-surface'>
						{/* <Link
							href='/'
							className='w-fit flex rounded-full transition-all focus-ring-base focus-ring-visible'
						>
							<Logo.Sign size={44} />
						</Link> */}

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

					<div className='scrollbar overflow-y-auto h-full flex flex-col p-surface gap-2'>
						{NAV_ITEMS.map(item => (
							<Button
								key={item.href}
								to={item.href}
								size='lg'
								mode={isActiveRoute(item.href) ? 'secondary' : 'ghost'}
								appearance='neutral'
								prefix={item.icon}
								suffix={
									isActiveRoute(item.href) && (
										<Icon28ChevronRightCircle width={20} height={20} />
									)
								}
								align='between'
							>
								{item.label}
							</Button>
						))}
					</div>

					<Separator />

					<div className='flex flex-col p-surface gap-surface'>
						<div className='flex items-center gap-surface'>
							<div className='w-9 h-9 flex items-center justify-center bg-surface border border-separator rounded-full overflow-hidden outline-2 outline-offset-3 outline-accent'>
								<Image
									className='w-full h-full object-cover'
									src='https://sun4-1.vkuserphoto.ru/s/v1/ig2/n3nqzN5xnpFxjN4P_PorpYzxFrr0MPC0if18Ig6M-2hiazfI_HMUl3rGs2JxZeBkXDmdSq7adb_30etn94CM2gw6.jpg?quality=95&crop=588,413,1324,1324&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&u=NIn875gpgJ9l6ZE_kSrqoPNZtN80SrGXimwoD0q4YDE&cs=200x200'
									alt=''
									width={200}
									height={200}
								/>
							</div>

							<p className='flex-1 text-lg font-condensed font-medium truncate'>
								Andrew S.
							</p>

							<Button
								mode='ghost'
								appearance='neutral'
								prefix={<Icon28MoreHorizontal width={18} height={18} />}
								radius='rounded'
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
