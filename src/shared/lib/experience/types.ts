export const EMPLOYMENT_TYPES = [
	{ key: 'full-time', label: 'Full-time' },
	{ key: 'part-time', label: 'Part-time' },
	{ key: 'contract', label: 'Contract' },
	{ key: 'freelance', label: 'Freelance' },
	{ key: 'internship', label: 'Internship' },
] as const

export const EXPERIENCE_POSITIONS = [
	{ key: 'graphic-designer', label: 'Graphic Designer' },
	{ key: 'ui-ux', label: 'UI/UX' },
	{ key: 'frontend', label: 'Frontend' },
] as const

export const EXPERIENCE_SKILLS = [
	'Graphic Design',
	'Social Media',
	'Graphic Communication',
	'Web Design',
	'UI/UX',
	'Frontend',
	'AI',
	'3D',
] as const

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]['key']
export type ExperiencePosition = (typeof EXPERIENCE_POSITIONS)[number]['key']
export type ExperienceSkill = (typeof EXPERIENCE_SKILLS)[number]

export type ExperienceSticker = {
	url: string
	rotate: number
}

export type ExperienceCompany = {
	id: string
	name: string
	slug: string
	logo: string
	url: string | null
	summary: string
}

export type ExperienceArticle = {
	id: string
	title: string
	slug: string | null
}

export type Experience = {
	id: string
	company_id: string
	company: ExperienceCompany | null
	employment_type: EmploymentType
	positions: ExperiencePosition[]
	summary: string
	start_on: string
	end_on: string | null
	stickers: ExperienceSticker[]
	skills: string[]
	article_id: string | null
	article: ExperienceArticle | null
	priority: number
	created_at: string
	updated_at: string
}

export type ExperienceInput = {
	company_id: string
	employment_type: EmploymentType
	positions: ExperiencePosition[]
	summary?: string
	start_on: string
	end_on?: string | null
	stickers?: ExperienceSticker[]
	skills?: string[]
	article_id?: string | null
	priority?: number
}

export const MONTH_OPTIONS = [
	{ label: 'January', value: '01' },
	{ label: 'February', value: '02' },
	{ label: 'March', value: '03' },
	{ label: 'April', value: '04' },
	{ label: 'May', value: '05' },
	{ label: 'June', value: '06' },
	{ label: 'July', value: '07' },
	{ label: 'August', value: '08' },
	{ label: 'September', value: '09' },
	{ label: 'October', value: '10' },
	{ label: 'November', value: '11' },
	{ label: 'December', value: '12' },
] as const

function isEmploymentType(value: string): value is EmploymentType {
	return EMPLOYMENT_TYPES.some(item => item.key === value)
}

export function isExperiencePosition(value: string): value is ExperiencePosition {
	return EXPERIENCE_POSITIONS.some(item => item.key === value)
}

export function formatEmploymentType(value: EmploymentType | string) {
	return EMPLOYMENT_TYPES.find(item => item.key === value)?.label ?? value
}

export function formatExperiencePosition(value: ExperiencePosition | string) {
	return EXPERIENCE_POSITIONS.find(item => item.key === value)?.label ?? value
}

export function yearMonthFromDate(value: string) {
	return value.slice(0, 7)
}

export function dateFromYearMonth(year: string, month: string) {
	const y = year.trim()
	const m = month.trim().padStart(2, '0')
	if (!/^\d{4}$/.test(y) || !/^(0[1-9]|1[0-2])$/.test(m)) return ''
	return `${y}-${m}-01`
}

function normalizeStickers(input: ExperienceSticker[] | undefined) {
	const next: ExperienceSticker[] = []

	for (const item of input ?? []) {
		const url = item.url?.trim()
		if (!url) continue
		const rotate = Number(item.rotate)
		next.push({
			url,
			rotate: Number.isFinite(rotate) ? Math.min(180, Math.max(-180, rotate)) : 0,
		})
		if (next.length === 3) break
	}

	return next
}

export function normalizeExperienceInput(input: ExperienceInput): ExperienceInput {
	const company_id = input.company_id.trim()
	const employment_type = input.employment_type
	const positions = [
		...new Set(input.positions.filter(isExperiencePosition)),
	].slice(0, 3)
	const summary = input.summary?.trim() ?? ''
	const start_on = input.start_on.trim()
	const end_on = input.end_on?.trim() || null
	const stickers = normalizeStickers(input.stickers)
	const skills = [...new Set((input.skills ?? []).map(item => item.trim()).filter(Boolean))]
	const article_id = input.article_id?.trim() || null
	const priority = Number.isFinite(input.priority) ? Number(input.priority) : 0

	return {
		company_id,
		employment_type,
		positions,
		summary,
		start_on,
		end_on,
		stickers,
		skills,
		article_id,
		priority,
	}
}

export function validateExperienceInput(input: ExperienceInput) {
	const data = normalizeExperienceInput(input)
	const errors: Partial<Record<keyof ExperienceInput, string>> = {}

	if (!data.company_id) errors.company_id = 'Выберите компанию'
	if (!isEmploymentType(data.employment_type)) {
		errors.employment_type = 'Некорректный тип занятости'
	}
	if (data.positions.length === 0) errors.positions = 'Укажите хотя бы одну должность'
	if (!/^\d{4}-\d{2}-01$/.test(data.start_on)) {
		errors.start_on = 'Укажите месяц и год начала'
	}
	if (data.end_on) {
		if (!/^\d{4}-\d{2}-01$/.test(data.end_on)) {
			errors.end_on = 'Укажите месяц и год окончания'
		} else if (data.end_on < data.start_on) {
			errors.end_on = 'Окончание раньше начала'
		}
	}

	return { data, errors, ok: Object.keys(errors).length === 0 }
}
