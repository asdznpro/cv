import { listAdminArticles } from 'lib/articles'
import { ArticlesManager } from 'widgets/admin'

export default async function ArticlesPage() {
	const articles = await listAdminArticles()

	return (
		<>
			<span />

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<ArticlesManager articles={articles} />
			</section>

			<span />
		</>
	)
}
