'use client'

import { useAdminShell } from '../shell'
import { Button } from 'ui/blocks'

import {
	Icon28HorizontalRectangle2VerticalLeftOutline,
	Icon28ArrowLeftOutline,
	Icon28GlobeOutline,
} from '@vkontakte/icons'

export function Header() {
	const { open, toggle } = useAdminShell()

	return (
		<header className='sticky top-0 z-10'>
			<div className='mx-auto max-w-2xl h-19 flex items-center px-app'>
				<div className='w-full flex items-center p-2 gap-2 bg-background border border-separator rounded-full'>
					<span className='w-full flex gap-app'>
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
					</span>

					<span className='w-full flex justify-end gap-2'>
						<Button
							to='/'
							size='lg'
							appearance='neutral'
							prefix={<Icon28GlobeOutline width={20} height={20} />}
							radius='rounded'
							iconOnly
						/>
					</span>
				</div>
			</div>
		</header>
	)
}
