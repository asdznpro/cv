import { Button } from 'ui/blocks'

export function NotFoundScreen() {
	return (
		<>
			<span className='h-24' />

			<section className='relative mx-auto max-w-2xl w-full h-full flex flex-1 flex-col items-center justify-center px-app gap-6'>
				<h1 className='text-9xl text-danger font-semibold font-condensed tracking-tight'>
					404
				</h1>

				<p className='text-xl font-semibold uppercase'>
					Ah shit, page not found
				</p>

				<Button to='/' size='lg' appearance='neutral' radius='rounded'>
					Go to home
				</Button>

				<span className='-z-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 container w-[120%] aspect-square animate-[fade-in_500ms_ease-out] bg-radial from-danger/20 to-60% to-background pointer-events-none' />
			</section>

			<span className='h-24' />
		</>
	)
}
