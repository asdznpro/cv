import Link from 'next/link'

import { twMerge } from 'tailwind-merge'

import { Badge, Button, Separator } from 'ui/blocks'
import { Logo } from 'ui/brand'

import {
	Icon28AddOutline,
	Icon28HieroglyphCharacterOutline,
	Icon28LinkOutline,
} from '@vkontakte/icons'

export function Header() {
	return (
		<header className='fixed top-0 z-20 w-full max-h-screen'>
			<div className='mx-auto max-w-3xl flex items-center px-app mt-app'>
				<div className='w-full flex flex-col bg-background border border-separator rounded-4xl backdrop-blur-3xl overflow-hidden'>
					<div className='w-full flex items-center p-2 gap-2'>
						<span className='w-full flex gap-app'>
							<Link href='/' className='flex'>
								<Logo.Sign width={44} height={44} />
							</Link>
						</span>

						<span className='text-2xl font-medium font-condensed tracking-tight whitespace-nowrap'>
							<Link
								href='/'
								className='text-foreground-tertiary hover:text-foreground hover:underline transition-all'
							>
								CV
							</Link>{' '}
							<span className='text-foreground-tertiary select-none'>/</span>{' '}
							<span>Home</span>
						</span>

						<span className='w-full flex justify-end gap-2'>
							<Button
								size='lg'
								mode='secondary'
								appearance='neutral'
								prefix={
									<Icon28HieroglyphCharacterOutline width={20} height={20} />
								}
								radius='rounded'
							>
								RU
							</Button>

							<Button
								size='lg'
								appearance='neutral'
								prefix={<Icon28AddOutline width={20} height={20} />}
								radius='rounded'
								iconOnly
							/>
						</span>
					</div>

					<Separator />

					<div className='grid grid-cols-2 @lg:grid-cols-4 p-2 gap-2'>
						<nav className='col-span-2 row-span-2 flex flex-col gap-2'>
							{['Portfolio', 'Experience', 'Skills', 'Contact'].map(item => (
								<Link
									key={item}
									href={`/${item.toLowerCase()}`}
									className={twMerge(
										'w-full h-14 flex items-center px-4 rounded-lg transition-colors',
										item === 'Experience'
											? 'bg-surface'
											: 'text-foreground-secondary hover:bg-surface',
									)}
								>
									<span className='text-2xl font-medium font-condensed tracking-tight truncate'>
										{item}
									</span>
								</Link>
							))}
						</nav>

						{[...Array(4)].map((_, index) => (
							<a
								key={index}
								href='https://github.com/asdzn'
								target='_blank'
								rel='noopener noreferrer'
								className='root relative w-full h-full flex items-end p-4 rounded-lg transition-colors bg-vk hover:bg-vk-secondary'
							>
								<Badge
									className='absolute top-2 right-2'
									size='md'
									appearance='neutral'
									prefix={<Icon28LinkOutline width={14} height={14} />}
								/>

								<span className='text-2xl font-medium font-condensed tracking-tight truncate'>
									GitHub
								</span>
							</a>
						))}
					</div>

					<Separator />

					<div className='w-full flex items-center p-2 gap-2'>
						<div className='w-full h-14 flex items-center px-4 gap-4 text-foreground-tertiary'>
							<span>
								&copy; {new Date().getFullYear()}, Andrew Sukhushin / CV
							</span>

							<span className='ml-auto'>v0.2.6-beta, 29.1.26</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
