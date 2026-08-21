import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

import type { PluggableList } from 'unified'

import {
	rehypeImageFigure,
	rehypeMasonry,
	rehypeQuote,
	rehypeSpotify,
} from '../plugins'
import { prettyCodeOptions } from './pretty-code.options'

export const markdownRehypePlugins: PluggableList = [
	[rehypePrettyCode, prettyCodeOptions],
	rehypeImageFigure,
	rehypeMasonry,
	rehypeQuote,
	rehypeSpotify,
	rehypeSlug,
	[
		rehypeAutolinkHeadings,
		{
			behavior: 'append',
			properties: { className: ['heading-anchor'] },
			content: { type: 'text', value: '#' },
		},
	],
]
