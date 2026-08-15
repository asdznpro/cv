import { listAdminArticles } from 'lib/articles'
import { listCompanies } from 'lib/companies'

import { ExperienceEditorManager } from 'widgets/admin'

export default async function NewArticlePage() {
	return (
		<>
			<span />

			<ExperienceEditorManager />

			<span />
		</>
	)
}
