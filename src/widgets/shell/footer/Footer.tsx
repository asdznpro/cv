import Link from 'next/link'

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

			<div className='mx-auto container w-full flex flex-wrap px-app gap-app text-xl text-foreground-tertiary'>
				<span className='mr-auto'>
					&copy; {new Date().getFullYear()}, Andrew Sukhushin / CV
				</span>

				<span>v2.1.7, 16.7.26</span>
			</div>
		</footer>
	)
}
