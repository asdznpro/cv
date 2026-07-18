import 'server-only'

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.join(process.cwd(), 'src/content')

export type MarkdownFile<TFrontmatter = Record<string, unknown>> = {
	content: string
	frontmatter: TFrontmatter
}

export async function getMarkdown<TFrontmatter = Record<string, unknown>>(
	relativePath: string,
): Promise<MarkdownFile<TFrontmatter>> {
	const file = path.join(CONTENT_ROOT, `${relativePath}.md`)
	const raw = await fs.readFile(file, 'utf8')
	const { content, data } = matter(raw)

	return { content, frontmatter: data as TFrontmatter }
}
