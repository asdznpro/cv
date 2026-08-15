import { listAdminArticles } from 'lib/articles'
import { listCompanies } from 'lib/companies'
import { listAdminExperiences } from 'lib/experience'

import { ExperienceEditorManager } from 'widgets/admin'

export default async function NewExperiencePage() {
	const [companies, articles, experiences] = await Promise.all([
		listCompanies(),
		listAdminArticles(),
		listAdminExperiences(),
	])

	return (
		<>
			<span />

			<ExperienceEditorManager
				experience={null}
				companies={companies}
				articles={articles.map(item => ({
					id: item.id,
					title: item.title,
				}))}
				experienceOptions={experiences.map(item => ({
					id: item.id,
					label: item.company?.name ?? item.positions[0] ?? item.id,
				}))}
			/>

			<span />
		</>
	)
}
