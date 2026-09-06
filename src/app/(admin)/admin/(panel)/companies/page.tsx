import { Suspense } from 'react'
import type { Metadata } from 'next'

import { listCompanies } from 'lib/companies'

import { CompaniesManager } from 'widgets/admin'
import { FlickerSpinner } from 'ui/blocks'

export const metadata: Metadata = {
	title: 'Companies',
	description: 'Manage your companies',
}

// export default async function CompaniesPage() {
// 	const companies = await listCompanies()

// 	return (
// 		<>
// 			<span />

// 			<CompaniesManager companies={companies} />

// 			<span />
// 		</>
// 	)
// }

export default function CompaniesPage() {
	return (
		<>
			<span />

			<Suspense fallback={<CompaniesFallback />}>
				<CompaniesData />
			</Suspense>

			<span />
		</>
	)
}

async function CompaniesData() {
	const companies = await listCompanies()
	return <CompaniesManager companies={companies} />
}

function CompaniesFallback() {
	return (
		<section className='mx-auto max-w-2xl w-full h-full flex flex-1 flex-col items-center justify-center px-app gap-6'>
			<FlickerSpinner size={32} />

			<span className='h-22' />
		</section>
	)
}
