import type { Metadata } from 'next'

import { listCompanies } from 'lib/companies'

import { CompaniesManager } from 'widgets/admin'

export const metadata: Metadata = {
	title: 'Companies',
	description: 'Manage your companies',
}

export default async function CompaniesPage() {
	const companies = await listCompanies()

	return (
		<>
			<span />

			<CompaniesManager companies={companies} />

			<span />
		</>
	)
}
