import { listCompanies } from 'lib/companies'
import { CompaniesManager } from 'widgets/admin'

export default async function CompaniesPage() {
	const companies = await listCompanies()

	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<CompaniesManager companies={companies} />
			</section>

			<span />
		</>
	)
}
