import Link from 'next/link'

import { Button } from 'ui/blocks'
import { Logo } from 'ui/brand'

import {
	Icon28HieroglyphCharacterOutline,
	Icon28MenuOutline,
} from '@vkontakte/icons'

export function Header() {
	return (
		<div className='mx-auto max-w-container flex items-center px-app mt-app'>
			<div className='w-full flex items-center p-app gap-app bg-background/80 border border-separator rounded-full backdrop-blur-3xl'>
				<span className='w-full flex items-center gap-app'>
					{/* <Button
					mode='soft'
					appearance='neutral'
					prefix={<Icon28MenuOutline width={18} height={18} />}
					radius='rounded'
					iconOnly
				/> */}

					<Link href='/' className='flex'>
						<Logo.Lockup />
					</Link>
				</span>

				<span className='flex gap-1.5'>
					{['About', 'Experience', 'Portfolio', 'Skills'].map(item => (
						<Button
							key={item}
							mode={item === 'About' ? 'secondary' : 'ghost'}
							appearance='neutral'
							radius='rounded'
						>
							{item}
						</Button>
					))}
				</span>

				<span className='w-full flex justify-end gap-app'>
					<Button
						appearance='neutral'
						prefix={<Icon28HieroglyphCharacterOutline width={18} height={18} />}
						radius='rounded'
					>
						RU
					</Button>
				</span>
			</div>
		</div>
	)
}
