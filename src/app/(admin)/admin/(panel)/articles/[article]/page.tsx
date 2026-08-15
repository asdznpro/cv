import { notFound } from 'next/navigation'

import { getAdminArticle, listAdminArticles } from 'lib/articles'
import { listCompanies } from 'lib/companies'

import { ArticleEditorManager } from 'widgets/admin'

export default async function EditArticlePage({
	params,
}: {
	params: Promise<{ article: string }>
}) {
	const { article: id } = await params
	const [article, companies, articles] = await Promise.all([
		getAdminArticle(id),
		listCompanies(),
		listAdminArticles(),
	])

	if (!article) notFound()

	return (
		<>
			<span />

			<ArticleEditorManager
				article={article}
				companies={companies}
				articleOptions={articles.map((item) => ({
					id: item.id,
					title: item.title,
				}))}
			/>

			<span />
		</>
	)
}
