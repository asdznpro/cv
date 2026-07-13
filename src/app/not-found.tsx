import { Button } from 'ui/blocks'

export default function NotFound() {
	return (
		<>
			<span />

			<section className='mx-auto max-w-container w-full flex flex-col items-center px-app gap-6'>
				<h1 className='text-9xl text-danger font-semibold font-condensed tracking-tight'>
					404
				</h1>

				<p className='text-xl font-semibold uppercase'>
					Хо щит, страница не найдена
				</p>

				<Button to='/' mode='soft' appearance='neutral' radius='rounded'>
					Вернуться на главную
				</Button>
			</section>

			<span />
		</>
	)
}
