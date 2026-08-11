import { listAdminArticles } from 'lib/articles'
import { listCompanies } from 'lib/companies'
import { ArticleEditorManager } from 'widgets/admin'

export default async function NewArticlePage() {
	const [companies, articles] = await Promise.all([
		listCompanies(),
		listAdminArticles(),
	])

	return (
		<>
			<span />

			<ArticleEditorManager
				article={null}
				companies={companies}
				articleOptions={articles.map(item => ({
					id: item.id,
					title: item.title,
				}))}
			/>

			<span />
		</>
	)
}
