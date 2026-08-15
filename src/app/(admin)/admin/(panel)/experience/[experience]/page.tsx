import { notFound } from 'next/navigation'

import { listAdminArticles } from 'lib/articles'
import { listCompanies } from 'lib/companies'
import { getAdminExperience, listAdminExperiences } from 'lib/experience'

import { ExperienceEditorManager } from 'widgets/admin'

export default async function EditExperiencePage({
	params,
}: {
	params: Promise<{ experience: string }>
}) {
	const { experience: id } = await params
	const [experience, companies, articles, experiences] = await Promise.all([
		getAdminExperience(id),
		listCompanies(),
		listAdminArticles(),
		listAdminExperiences(),
	])

	if (!experience) notFound()

	return (
		<>
			<span />

			<ExperienceEditorManager
				experience={experience}
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
