import type { Element as HastElement, Text } from 'hast'

export function getNodeDataProperty(
	properties: HastElement['properties'] | undefined,
	name: string,
): string | undefined {
	if (!properties) return undefined

	const camel = `data${name.charAt(0).toUpperCase()}${name.slice(1)}`
	const kebab = `data-${name}`

	for (const key of [camel, kebab]) {
		const value = properties[key as keyof typeof properties]
		if (typeof value === 'string') return value
		if (typeof value === 'number') return String(value)
	}

	return undefined
}

export function elementToText(node: HastElement): string {
	return node.children
		.map(child => {
			if (child.type === 'text') return (child as Text).value
			if (child.type === 'element') return elementToText(child as HastElement)
			return ''
		})
		.join('')
		.trim()
}

export function hastElementToText(node: HastElement): string {
	return elementToText(node)
}

export function getImageCaption(node?: HastElement): string {
	const figcaption = node?.children?.find(
		(c): c is HastElement => c.type === 'element' && c.tagName === 'figcaption',
	)

	if (figcaption) return hastElementToText(figcaption)

	return getNodeDataProperty(node?.properties, 'caption') ?? ''
}
