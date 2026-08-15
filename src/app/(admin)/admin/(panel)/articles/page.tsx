import { listAdminArticles } from 'lib/articles'

import { ArticlesManager } from 'widgets/admin'

export default async function ArticlesPage() {
	const articles = await listAdminArticles()

	return (
		<>
			<span />

			<ArticlesManager articles={articles} />

			<span />
		</>
	)
}
