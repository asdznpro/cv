import rehypePrettyCode from 'rehype-pretty-code'
import type { PluggableList } from 'unified'

import { rehypeImageFigure, rehypeMasonry, rehypeQuote } from '../plugins'

import { prettyCodeOptions } from './pretty-code.options'

export const markdownRehypePlugins: PluggableList = [
	[rehypePrettyCode, prettyCodeOptions],
	rehypeImageFigure,
	rehypeMasonry,
	rehypeQuote,
]
