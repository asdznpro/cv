export default function Home() {
	return (
		<div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
			<main className='flex flex-1 w-full max-w-2xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start text-balance'>
				<div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
					<h1 className='text-5xl font-condensed font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 uppercase'>
						To get started, edit the page.tsx file.
					</h1>

					<h2 className='text-3xl font-condensed font-semibold leading-tight tracking-tight text-black dark:text-zinc-50'>
						To get started, edit the page.tsx file.
					</h2>

					<p className='text-lg text-zinc-600 dark:text-zinc-400'>
						Looking for a starting point or more instructions? Head over to{' '}
						<a
							href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-zinc-950 dark:text-zinc-50'
						>
							Templates
						</a>{' '}
						or the{' '}
						<a
							href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-zinc-950 dark:text-zinc-50'
						>
							Learning
						</a>{' '}
						center.
					</p>

					<p className='text-sm text-zinc-600 dark:text-zinc-400 font-condensed uppercase'>
						Looking for a starting point or more instructions? Head over to{' '}
						<a
							href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-zinc-950 dark:text-zinc-50'
						>
							Templates
						</a>{' '}
						or the{' '}
						<a
							href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-zinc-950 dark:text-zinc-50'
						>
							Learning
						</a>{' '}
						center.
					</p>

					<p className='text-sm text-zinc-600 dark:text-zinc-400 font-mono tracking-tighter'>
						Looking for a starting point or more instructions? Head over to{' '}
						<a
							href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-zinc-950 dark:text-zinc-50'
						>
							Templates
						</a>{' '}
						or the{' '}
						<a
							href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
							className='font-medium text-zinc-950 dark:text-zinc-50'
						>
							Learning
						</a>{' '}
						center.
					</p>
				</div>
			</main>
		</div>
	)
}
