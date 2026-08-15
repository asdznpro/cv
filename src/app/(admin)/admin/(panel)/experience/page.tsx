import { listAdminExperiences } from 'lib/experience'

import { ExperienceManager } from 'widgets/admin'

export default async function ExperiencePage() {
	const experiences = await listAdminExperiences()

	return (
		<>
			<span />

			<ExperienceManager experiences={experiences} />

			<span />
		</>
	)
}
