'use client'

import Link from 'next/link'

import { useAdminShell } from '../shell'
import { Button } from 'ui/blocks'

import {
	Icon28HorizontalRectangle2VerticalLeftOutline,
	Icon28GlobeOutline,
} from '@vkontakte/icons'

export function Header() {
	const { open, toggle } = useAdminShell()

	return (
		<header className='sticky top-0 z-10'>
			<div className='mx-auto max-w-lg flex items-center p-app'>
				<div className='w-full flex items-center p-2 gap-2 bg-background border border-separator rounded-full'>
					<span className='w-full flex gap-app'>
						<Button
							aria-label={open ? 'Hide sidebar' : 'Show sidebar'}
							onClick={toggle}
							mode='soft'
							appearance='neutral'
							prefix={
								<Icon28HorizontalRectangle2VerticalLeftOutline
									className='rotate-180'
									width={18}
									height={18}
								/>
							}
							radius='rounded'
							iconOnly
						/>
					</span>

					<span className='text-xl font-medium font-condensed tracking-tight whitespace-nowrap'>
						<Link
							href='/admin'
							className='text-foreground-tertiary hover:text-foreground transition-all'
						>
							Admin
						</Link>{' '}
						<span className='text-foreground-tertiary select-none'>/</span>{' '}
						<span className='inline-block'>Overview</span>
					</span>

					<span className='w-full flex justify-end gap-2'>
						<Button
							to='/'
							appearance='neutral'
							prefix={<Icon28GlobeOutline width={18} height={18} />}
							radius='rounded'
							iconOnly
						/>
					</span>
				</div>
			</div>
		</header>
	)
}
