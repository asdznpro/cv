import type { Components } from 'react-markdown'

import {
	renderCode,
	renderCodeDiv,
	renderCodeFigcaption,
	renderCodeFigure,
	renderImageFigure,
	renderQuoteBlock,
	renderMasonryBlock,
} from './blocks'

import { typographyComponents } from './config/typography.components'

export const markdownComponents: Components = {
	...typographyComponents,

	blockquote: props => renderQuoteBlock(props),

	div: props => renderMasonryBlock(props) ?? renderCodeDiv(props),

	figure: props => {
		const codeFigure = renderCodeFigure(props)
		if (codeFigure) return codeFigure

		const imageFigure = renderImageFigure(props)
		if (imageFigure) return imageFigure

		const { children, ...rest } = props
		return <figure {...rest}>{children}</figure>
	},

	figcaption: props => renderCodeFigcaption(props),

	code: props => renderCode(props),
}
