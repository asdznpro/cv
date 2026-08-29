import type { Metadata } from 'next'

import { listAdminExperiences } from 'lib/experience'

import { ExperienceManager } from 'widgets/admin'

export const metadata: Metadata = {
	title: 'Experience',
	description: 'Manage your experience',
}

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
