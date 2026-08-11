'use server'

import { getVisitorHash } from './visitor-hash'
import { recordArticleView } from './record-view'

/** Public engagement: page view or outbound link click. */
export async function trackArticleEngagement(articleId: string): Promise<void> {
	if (!articleId) return

	const visitorHash = await getVisitorHash()
	await recordArticleView(articleId, visitorHash)
}
