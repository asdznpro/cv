'use client'

import { useAdminShell } from '../shell'
import { Button } from 'ui/blocks'

import {
	Icon28HorizontalRectangle2VerticalLeftOutline,
	Icon28ArrowLeftOutline,
} from '@vkontakte/icons'

export function Header() {
	const { open, toggle } = useAdminShell()

	return (
		<header className='sticky top-0 z-10'>
			<div className='mx-auto max-w-3xl h-19 flex items-center px-app'>
				<div className='w-full flex items-center p-2 gap-2 bg-background border border-separator rounded-full'>
					<Button
						aria-label={open ? 'Hide sidebar' : 'Show sidebar'}
						onClick={toggle}
						size='lg'
						mode='soft'
						appearance='neutral'
						prefix={
							open ? (
								<Icon28ArrowLeftOutline width={20} height={20} />
							) : (
								<Icon28HorizontalRectangle2VerticalLeftOutline
									className='rotate-180'
									width={20}
									height={20}
								/>
							)
						}
						radius='rounded'
						iconOnly
					/>
				</div>
			</div>
		</header>
	)
}
