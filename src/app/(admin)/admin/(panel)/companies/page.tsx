import { listCompanies } from 'lib/companies'
import { CompaniesManager } from 'widgets/admin'

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
