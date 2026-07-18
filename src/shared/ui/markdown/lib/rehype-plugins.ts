import rehypePrettyCode from 'rehype-pretty-code'
import type { PluggableList } from 'unified'

import { rehypeImageFigure } from '../plugins/rehype-image-figure'
import { rehypeQuote } from '../plugins/rehype-quote'
import { prettyCodeOptions } from './pretty-code.options'

export const markdownRehypePlugins: PluggableList = [
	[rehypePrettyCode, prettyCodeOptions],
	rehypeImageFigure,
	rehypeQuote,
]
