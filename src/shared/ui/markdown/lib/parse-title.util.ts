export type ImageVariant = 'framed' | 'plain'
export type QuoteVariant = 'pull' | 'border'

export function parseTitle(title?: string) {
	if (!title) {
		return { variant: 'framed' as ImageVariant, caption: '' }
	}

	const attrs: Record<string, string> = {}
	const regex = /(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g

	for (const match of title.matchAll(regex)) {
		attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? ''
	}

	return {
		variant: (attrs.variant === 'plain' ? 'plain' : 'framed') as ImageVariant,
		caption: attrs.caption ?? '',
	}
}

export function parseAttribution(line: string): string | undefined {
	const match = line.trim().match(/^[—–-]\s*(.+)$/)
	return match?.[1]?.trim()
}

export function stripQuotes(text: string): string {
	return text.replace(/^["""]|["""]$/g, '').trim()
}
