import { getAdminSession } from 'lib/auth'
import { listAdminArticles, listArticles } from 'lib/articles'

import { Button } from 'ui/blocks'
import { Icon28CopyOutline } from '@vkontakte/icons'

import { ArticlesList } from './ArticlesList'

export default async function Articles() {
	const session = await getAdminSession()
	const articles = session
		? await listAdminArticles()
		: await listArticles({ status: 'published' })

	return (
		<>
			<span className='h-24' />

			<section className='mx-auto max-w-4xl w-full flex flex-col px-app gap-20'>
				<div className='flex gap-app'>
					<div className='flex flex-1 flex-col gap-3'>
						<h1 className='text-5xl font-semibold font-condensed tracking-tight uppercase'>
							Articles
						</h1>
					</div>

					<Button
						mode='soft'
						appearance='neutral'
						prefix={<Icon28CopyOutline width={18} height={18} />}
						radius='rounded'
						iconOnly
					/>
				</div>

				<ArticlesList articles={articles} showStatus={Boolean(session)} />
			</section>

			<span />
		</>
	)
}
