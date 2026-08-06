import { twMerge } from 'tailwind-merge'

import { StickerPeel } from 'ui/effects'
import { Badge } from 'ui/blocks'
import { Icon28GlobeCrossOutline, Icon28LinkOutline } from '@vkontakte/icons'

const SOCIAL_ITEMS = [
	// {
	// 	label: 'HH',
	// 	href: 'https://github.com/asdzn',
	// 	// icon: <Icon28LinkOutline width={20} height={20} />,
	// 	// className: 'text-white bg-hh hover:bg-hh-secondary',
	// 	className: 'hover:text-white hover:bg-hh',
	// },
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/asdzn',
		className: 'hover:text-white hover:bg-linkedin',
		restrictedIn: ['RU'],
		sticker: {
			image: '/assets/sticker/linkedin.svg',
			rotate: 20,
			position: { x: 92, y: -12 },
		},
	},
	{
		label: 'Telegram',
		href: 'https://telegram.me/asdznpro',
		className: 'hover:text-white hover:bg-telegram',
		restrictedIn: ['RU'],
		sticker: {
			image: '/assets/sticker/telegram.svg',
			rotate: -4,
			position: { x: 48, y: 32 },
		},
	},
	{
		label: 'GitHub',
		href: 'https://github.com/asdzn',
		className: 'hover:text-white hover:bg-github',
		sticker: {
			image: '/assets/sticker/github.svg',
			rotate: -12,
			position: { x: 64, y: -28 },
		},
	},
	{
		label: 'VK',
		href: 'https://vk.com/asdzn',
		className: 'hover:text-white hover:bg-vk',
		sticker: {
			image: '/assets/sticker/vk.svg',
			rotate: 8,
			position: { x: 56, y: 20 },
		},
	},
	// {
	// 	label: 'X',
	// 	href: 'https://x.com/asdznpro',
	// 	// icon: <Icon28LinkOutline width={20} height={20} />,
	// 	// className: 'text-black bg-gray-100 hover:bg-white',
	// 	className: 'hover:text-black hover:bg-white',
	// 	restrictedIn: ['RU'],
	// },
]

export function Footer() {
	return (
		<footer className='mt-auto w-full flex flex-col py-12 @2xl:py-24 gap-12 bg-background border-t border-separator'>
			<div className='mx-auto max-w-6xl w-full flex flex-col px-app gap-app'>
				<div className='grid grid-cols-2 @5xl:grid-cols-5 gap-app'>
					{SOCIAL_ITEMS.map((item, index) => (
						<div
							key={index + item.label}
							className={twMerge(
								'relative flex',
								index === 0 && '@5xl:col-span-2',
							)}
						>
							<a
								href={item.href}
								target='_blank'
								rel='noopener noreferrer'
								className={twMerge(
									'root relative w-full flex items-end p-6 rounded-xl transition-colors focus-ring-base focus-ring-visible',
									'text-foreground-secondary bg-surface-secondary',
									index === 0 && '@5xl:col-span-2',
									item.className,
								)}
							>
								<span className='absolute top-2 right-2 flex gap-1'>
									{item.restrictedIn && (
										<Badge
											title='Может быть недоступен в РФ'
											aria-label='Ограничен в РФ'
											size='md'
											appearance='danger'
											prefix={
												<Icon28GlobeCrossOutline width={14} height={14} />
											}
											// className='text-danger'
										/>
									)}

									<Badge
										size='md'
										appearance='neutral'
										prefix={<Icon28LinkOutline width={14} height={14} />}
									/>
								</span>

								<span className='text-2xl font-medium font-condensed tracking-tight truncate'>
									{item.label}
								</span>
							</a>

							<StickerPeel
								className='z-1'
								imageSrc={item.sticker.image}
								width={80}
								rotate={item.sticker.rotate}
								peelBackHoverPct={30}
								peelBackActivePct={40}
								shadowIntensity={0}
								lightingIntensity={0.1}
								initialPosition={item.sticker.position}
								peelDirection={0}
							/>
						</div>
					))}
				</div>
			</div>

			<div className='mx-auto max-w-6xl w-full flex flex-wrap px-app gap-app text-base @2xl:text-xl text-foreground-tertiary'>
				<span className='mr-auto'>
					&copy; {new Date().getFullYear()}, Andrew Sukhushin / CV
				</span>

				<span>v2.1.18, 29.7.26</span>
			</div>
		</footer>
	)
}
