import Link from 'next/link'

import { Button, Kbd } from 'ui/blocks'
import { Logo } from 'ui/brand'
import { Input } from 'ui/forms'

import {
	Icon24NotificationOutline,
	Icon24SquareGrid3x3,
	Icon28DoorArrowLeftOutline,
	Icon28Fire,
	Icon28SearchOutline,
} from '@vkontakte/icons'

export function Header() {
	return (
		<div className='mx-auto max-w-container flex @3xl:grid grid-cols-3 items-center p-app mt-app gap-app bg-background/80 border border-separator rounded-full backdrop-blur-3xl'>
			<span className='flex items-center gap-app'>
				<Button
					mode='soft'
					appearance='neutral'
					prefix={<Icon24SquareGrid3x3 width={18} height={18} />}
					radius='rounded'
					iconOnly
				/>

				<Link href='/' className='flex'>
					<Logo.Lockup width={151} height={28} />
				</Link>
			</span>

			<Input
				className='w-full flex-1'
				size='md'
				mode='outline'
				id='test'
				type='text'
				placeholder='Search Profiles, Agents, Maps, etc.'
				prefix={<Icon28SearchOutline width={18} height={18} />}
				suffix={
					<>
						<Kbd size='sm'>Ctrl + K</Kbd> <Kbd size='sm'>Esc</Kbd>
					</>
				}
			/>

			<span className='flex justify-end gap-app'>
				<Button prefix={<Icon28Fire width={18} height={18} />} radius='rounded'>
					Premium
				</Button>

				<span className='flex gap-1.5'>
					<Button
						mode='soft'
						appearance='neutral'
						prefix={<Icon24NotificationOutline width={18} height={18} />}
						radius='rounded'
						iconOnly
					/>

					<Button
						to='/login'
						mode='secondary'
						appearance='neutral'
						suffix={<Icon28DoorArrowLeftOutline width={18} height={18} />}
						radius='rounded'
					>
						Sign in
					</Button>
				</span>
			</span>
		</div>
	)
}
