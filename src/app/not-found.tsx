import { Button } from 'ui/blocks'

export default function NotFound() {
	return (
		<>
			<span className='h-24' />

			<section className='mx-auto max-w-2xl w-full h-full flex flex-1 flex-col items-center justify-center px-app gap-6 bg-radial from-rose-800 to-60% to-background'>
				<h1 className='text-9xl text-danger font-semibold font-condensed tracking-tight'>
					404
				</h1>

				<p className='text-xl font-semibold uppercase'>
					Хо щит, страница не найдена
				</p>

				<Button to='/' size='lg' appearance='neutral' radius='rounded'>
					Вернуться на главную
				</Button>
			</section>

			<span />
		</>
	)
}
