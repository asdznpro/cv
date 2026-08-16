import { listExperiences } from 'lib/experience'
import { listToolkit } from 'lib/toolkit'

import { Hero } from 'widgets/hero'

import { ExperienceList } from './ExperienceList'

export default async function Home() {
	const [experiences, toolkit] = await Promise.all([
		listExperiences(),
		listToolkit(),
	])

	return (
		<>
			<Hero items={toolkit} />
			<ExperienceList experiences={experiences} />
		</>
	)
}
