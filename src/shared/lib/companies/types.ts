import { slugify } from 'transliteration'

export type Company = {
	id: string
	name: string
	slug: string
	logo: string
	url: string | null
	created_at: string
	updated_at: string
}

export type CompanyInput = {
	name: string
	slug: string
	logo: string
	url?: string | null
}

export function slugifyCompanyName(name: string) {
	return slugify(name, {
		lowercase: true,
		separator: '-',
		allowedChars: 'a-zA-Z0-9',
	})
}

export function normalizeCompanyInput(input: CompanyInput): CompanyInput {
	const name = input.name.trim()
	const slug = (input.slug.trim() || slugifyCompanyName(name)).toLowerCase()
	const logo = input.logo.trim()
	const url = input.url?.trim() || null

	return {
		name,
		slug,
		logo,
		url,
	}
}

export function validateCompanyInput(input: CompanyInput) {
	const data = normalizeCompanyInput(input)
	const errors: Partial<Record<keyof CompanyInput, string>> = {}

	if (!data.name) errors.name = 'Укажите название'
	if (!data.slug) errors.slug = 'Укажите slug'
	else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
		errors.slug = 'Только a-z, 0-9 и дефисы'
	}
	if (!data.logo) errors.logo = 'Загрузите логотип'

	return { data, errors, ok: Object.keys(errors).length === 0 }
}
