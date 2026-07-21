import Link from 'next/link'

import { twMerge } from 'tailwind-merge'

import { Icon28LinkOutline } from '@vkontakte/icons'
import { Badge } from 'ui/blocks'

const SOCIAL_ITEMS = [
	{
		label: 'HH',
		href: 'https://github.com/asdzn',
		// icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'text-white bg-hh hover:bg-hh-secondary',
	},
	{
		label: 'GitHub',
		href: 'https://github.com/asdzn',
		// icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'text-white bg-github hover:bg-github-secondary',
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/asdzn',
		// icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'text-white bg-linkedin hover:bg-linkedin-secondary',
	},
	{
		label: 'Telegram',
		href: 'https://telegram.me/asdznpro',
		// icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'text-white bg-telegram hover:bg-telegram-secondary',
	},
	{
		label: 'VK',
		href: 'https://vk.com/asdzn',
		// icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'text-white bg-vk hover:bg-vk-secondary',
	},
	{
		label: 'X',
		href: 'https://github.com/asdzn',
		// icon: <Icon28LinkOutline width={20} height={20} />,
		className: 'text-black bg-gray-50 hover:bg-gray-100',
	},
]

export function Footer() {
	return (
		<footer className='mt-auto w-full flex flex-col py-16 gap-16 bg-background border-t border-separator'>
			{/* <div className='mx-auto container w-full flex flex-col px-app gap-app'>
				<div className='flex flex-col p-surface gap-surface border border-separator rounded-lg'>
					<p className='text-sm text-foreground-tertiary font-condensed uppercase tracking-tight'>
						Продолжая использовать Lowtab.gg, вы принимаете условия нашей
						Политики конфиденциальности и Правил сервиса, а также соглашаетесь
						на обработку персональных данных, применение файлов cookie, средств
						аналитики и рекомендательных механизмов, необходимых для корректной
						работы платформы, повышения удобства использования и персонализации
						вашего пользовательского опыта.
					</p>

					<p className='text-sm text-foreground-tertiary font-condensed uppercase tracking-tight'>
						Все наименования продуктов и игр, названия компаний и брендов,
						логотипы, товарные знаки, изображения и иные материалы, размещённые
						на сайте, принадлежат их соответствующим правообладателям и
						используются исключительно в информационных, ознакомительных или
						идентификационных целях, если не указано иное.
					</p>
				</div>
			</div> */}

			<div className='mx-auto container w-full flex flex-col px-app gap-app'>
				<div className='grid grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-6 gap-app'>
					{SOCIAL_ITEMS.map((item, index) => (
						<a
							key={index + item.label}
							href={item.href}
							target='_blank'
							rel='noopener noreferrer'
							className={twMerge(
								'root relative w-full h-full flex items-end p-6 rounded-xl transition-colors focus-ring-base focus-ring-visible',
								item.className,
							)}
						>
							<Badge
								className='absolute top-2 right-2'
								size='md'
								appearance='neutral'
								prefix={<Icon28LinkOutline width={14} height={14} />}
							/>

							<span className='text-2xl font-medium font-condensed tracking-tight truncate'>
								{item.label}
							</span>
						</a>
					))}
				</div>
			</div>

			<div className='mx-auto container w-full flex flex-wrap px-app gap-app text-xl text-foreground-tertiary'>
				<span className='mr-auto'>
					&copy; {new Date().getFullYear()}, Andrew Sukhushin / CV
				</span>

				<span>v2.1.13, 21.7.26</span>
			</div>
		</footer>
	)
}
