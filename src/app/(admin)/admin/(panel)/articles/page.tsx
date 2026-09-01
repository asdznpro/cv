import type { Metadata } from 'next'

import { listAdminArticles } from 'lib/articles'

import { ArticlesManager } from 'widgets/admin'

export const metadata: Metadata = {
	title: 'Articles',
	description: 'Manage your articles',
}

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
