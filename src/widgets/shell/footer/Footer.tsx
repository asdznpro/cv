import Link from 'next/link'

const FOOTER_NAVIGATION = [
	{
		label: 'About us',
		items: [
			{
				label: 'About us',
				href: '/about',
			},
			{
				label: 'Advertising',
				href: '/advertising',
			},
			{
				label: 'Blog',
				href: '/blog',
			},
		],
	},
	{
		label: 'Additional',
		items: [
			{
				label: 'Technical support',
				href: '/support',
			},
			{
				label: 'API for developers',
				href: '/api',
			},
			{
				label: 'Privacy policy',
				href: '/privacy',
			},
			{
				label: 'Cooperation',
				href: '/cooperation',
			},
			{
				label: 'Press kit',
				href: '/press-kit',
			},
		],
	},
	{
		label: 'Terms',
		items: [
			{
				label: 'Terms of service',
				href: '/terms',
			},
			{
				label: 'Privacy policy',
				href: '/privacy',
			},
		],
	},
]

export function Footer() {
	return (
		<footer className='mt-auto flex flex-col py-16 gap-16 bg-background border-t border-separator'>
			<div className='mx-auto max-w-container w-full grid grid-cols-4 px-app gap-app'>
				{FOOTER_NAVIGATION.map(item => (
					<div key={item.label} className='flex flex-1 flex-col gap-6 text-sm'>
						<h3 className='font-bold font-mono tracking-tight uppercase'>
							{'[ ' + item.label + ' ]'}
						</h3>

						<ul className='flex flex-col gap-3'>
							{item.items.map(item => (
								<li key={item.label}>
									<Link
										href={item.href}
										className='text-foreground-secondary hover:text-foreground hover:underline transition-all'
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className='mx-auto max-w-container w-full flex flex-col px-app gap-app'>
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
			</div>

			<div className='mx-auto max-w-container w-full flex px-app gap-app text-sm text-foreground-tertiary'>
				<span>
					&copy; {new Date().getFullYear()},{' '}
					<Link href='/' className='underline'>
						Lowtab.gg
					</Link>
				</span>

				<span>12+</span>
				<span className='ml-auto'>v0.2.6-beta, 29.1.26</span>
			</div>
		</footer>
	)
}
