import { slugify } from 'transliteration'

export const TOOLKIT_AREAS = [
	{ key: 'design', label: 'Design' },
	{ key: 'motion', label: 'Motion' },
	{ key: 'frontend', label: 'Frontend' },
	{ key: 'backend', label: 'Backend' },
	{ key: 'infra', label: 'Infra' },
] as const

export const TOOLKIT_PROFICIENCIES = [
	{ key: 'core', label: 'Core' },
	{ key: 'frequent', label: 'Frequent' },
	{ key: 'occasional', label: 'Occasional' },
] as const

export const TOOLKIT_TAGS = [
	{ key: 'graphics', label: 'Graphics' },
	{ key: 'ui-ux', label: 'UI/UX' },
	{ key: 'animation', label: 'Animation' },
	{ key: 'video', label: 'Video' },
	{ key: 'fullstack', label: 'Fullstack' },
	{ key: 'ai', label: 'AI' },
	{ key: 'state', label: 'State' },
	{ key: 'database', label: 'Database' },
] as const

export type ToolkitArea = (typeof TOOLKIT_AREAS)[number]['key']
export type ToolkitProficiency = (typeof TOOLKIT_PROFICIENCIES)[number]['key']
export type ToolkitTag = (typeof TOOLKIT_TAGS)[number]['key']

export type ToolkitItem = {
	id: string
	slug: string
	name: string
	area: ToolkitArea
	tags: ToolkitTag[]
	proficiency: ToolkitProficiency
	color: string
	summary: string
	image: {
		lockup: {
			url: string
			size: { width: number; height: number }
			label: boolean
		}
		icon: {
			url: string
		}
	}
	priority: number
	created_at: string
	updated_at: string
}

export type ToolkitItemInput = {
	slug: string
	name: string
	area: ToolkitArea
	tags?: ToolkitTag[]
	proficiency: ToolkitProficiency
	color: string
	summary?: string
	lockup_url: string
	lockup_width: number
	lockup_height: number
	show_label?: boolean
	icon_url: string
	priority?: number
}

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isToolkitArea(value: string): value is ToolkitArea {
	return TOOLKIT_AREAS.some(item => item.key === value)
}

export function isToolkitProficiency(
	value: string,
): value is ToolkitProficiency {
	return TOOLKIT_PROFICIENCIES.some(item => item.key === value)
}

export function isToolkitTag(value: string): value is ToolkitTag {
	return TOOLKIT_TAGS.some(item => item.key === value)
}

export function formatToolkitArea(value: ToolkitArea | string) {
	return TOOLKIT_AREAS.find(item => item.key === value)?.label ?? value
}

export function formatToolkitProficiency(value: ToolkitProficiency | string) {
	return TOOLKIT_PROFICIENCIES.find(item => item.key === value)?.label ?? value
}

export function formatToolkitTag(value: ToolkitTag | string) {
	return TOOLKIT_TAGS.find(item => item.key === value)?.label ?? value
}

export function slugifyToolkitName(name: string) {
	return slugify(name, {
		lowercase: true,
		separator: '-',
		allowedChars: 'a-zA-Z0-9',
	})
}

export function normalizeToolkitInput(
	input: ToolkitItemInput,
): ToolkitItemInput {
	const name = input.name.trim()
	const slug = (input.slug.trim() || slugifyToolkitName(name)).toLowerCase()
	const tags = [...new Set((input.tags ?? []).filter(isToolkitTag))]
	const summary = input.summary?.trim() ?? ''
	const color = input.color.trim()
	const lockup_url = input.lockup_url.trim()
	const icon_url = input.icon_url.trim()
	const lockup_width = Number(input.lockup_width)
	const lockup_height = Number(input.lockup_height)
	const priority = Number.isFinite(input.priority) ? Number(input.priority) : 0

	return {
		name,
		slug,
		area: input.area,
		tags,
		proficiency: input.proficiency,
		color,
		summary,
		lockup_url,
		lockup_width,
		lockup_height,
		show_label: input.show_label ?? true,
		icon_url,
		priority,
	}
}

export function validateToolkitInput(input: ToolkitItemInput) {
	const data = normalizeToolkitInput(input)
	const errors: Partial<Record<keyof ToolkitItemInput, string>> = {}

	if (!data.name) errors.name = 'Укажите название'
	if (!data.slug) errors.slug = 'Укажите slug'
	else if (!SLUG.test(data.slug)) errors.slug = 'Только a-z, 0-9 и дефисы'
	if (!isToolkitArea(data.area)) errors.area = 'Некорректная область'
	if (!isToolkitProficiency(data.proficiency)) {
		errors.proficiency = 'Некорректный уровень'
	}
	if (!HEX_COLOR.test(data.color)) errors.color = 'Цвет в формате #RRGGBB'
	if (!data.lockup_url) errors.lockup_url = 'Загрузите lockup'
	if (!Number.isInteger(data.lockup_width) || data.lockup_width <= 0) {
		errors.lockup_width = 'Ширина lockup должна быть больше 0'
	}
	if (!Number.isInteger(data.lockup_height) || data.lockup_height <= 0) {
		errors.lockup_height = 'Высота lockup должна быть больше 0'
	}
	if (!data.icon_url) errors.icon_url = 'Загрузите иконку'

	return { data, errors, ok: Object.keys(errors).length === 0 }
}
