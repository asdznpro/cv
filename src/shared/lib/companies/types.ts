export type Company = {
	id: string
	name: string
	slug: string
	logo: string
	url: string | null
	sticker_image: string | null
	sticker_rotate: number | null
	created_at: string
	updated_at: string
}

export type CompanyInput = {
	name: string
	slug: string
	logo: string
	url?: string | null
	sticker_image?: string | null
	sticker_rotate?: number | null
}

export function slugifyCompanyName(name: string) {
	return name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
}

export function normalizeCompanyInput(input: CompanyInput): CompanyInput {
	const name = input.name.trim()
	const slug = (input.slug.trim() || slugifyCompanyName(name)).toLowerCase()
	const logo = input.logo.trim()
	const url = input.url?.trim() || null
	const sticker_image = input.sticker_image?.trim() || null
	const sticker_rotate =
		input.sticker_rotate === null || input.sticker_rotate === undefined
			? null
			: Number(input.sticker_rotate)

	return {
		name,
		slug,
		logo,
		url,
		sticker_image,
		sticker_rotate: Number.isFinite(sticker_rotate) ? sticker_rotate : null,
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
	if (!data.logo) errors.logo = 'Укажите путь к логотипу'

	return { data, errors, ok: Object.keys(errors).length === 0 }
}
