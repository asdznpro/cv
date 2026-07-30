import { Suspense } from 'react'

import { createServerClient } from 'lib/supabase'

async function InstrumentsData() {
	const supabase = await createServerClient()
	const { data: instruments } = await supabase.from('instruments').select()

	return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}

export default function Instruments() {
	return (
		<>
			<span className='h-24' />

			<section className='mx-auto container w-full flex flex-col px-app gap-8'>
				<h1 className='text-3xl font-semibold font-condensed tracking-tight'>
					Instruments
				</h1>

				<Suspense fallback={<div>Loading instruments...</div>}>
					<InstrumentsData />
				</Suspense>
			</section>
		</>
	)
}
