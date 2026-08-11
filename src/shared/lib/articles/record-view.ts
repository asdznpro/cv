import 'server-only'

import { createClient } from '@supabase/supabase-js'

import { getVisitorHash } from './visitor-hash'

function createRpcClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
	if (!url || !key) {
		throw new Error('Supabase env is not set')
	}

	return createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	})
}

/**
 * Record a published-article view.
 * Call getVisitorHash() in the request scope first if using next/server `after()`.
 */
export async function recordArticleView(
	articleId: string,
	visitorHash?: string,
): Promise<void> {
	if (!articleId) return

	try {
		const hash = visitorHash ?? (await getVisitorHash())
		if (!hash || hash.length < 16) return

		const supabase = createRpcClient()
		const { error } = await supabase.rpc('record_article_view', {
			p_article_id: articleId,
			p_visitor_hash: hash,
		})

		if (error) {
			console.error('[recordArticleView]', error.message)
		}
	} catch (error) {
		console.error('[recordArticleView]', error)
	}
}
