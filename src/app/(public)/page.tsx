import { listExperiences } from 'lib/experience'

import { Hero } from 'widgets/hero'

import { ExperienceList } from './ExperienceList'

export default async function Home() {
	const experiences = await listExperiences()

	return (
		<>
			<Hero />
			<ExperienceList experiences={experiences} />
		</>
	)
}
