import type { FormattedDateLanguage } from './get-formatted-date.util'

function pluralRu(count: number, one: string, few: string, many: string) {
	const mod10 = count % 10
	const mod100 = count % 100
	if (mod10 === 1 && mod100 !== 11) return one
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
	return many
}

function pluralEn(count: number, singular: string, plural: string) {
	return count === 1 ? singular : plural
}

/** Inclusive month span, e.g. June 2024 — April 2026 → 1 year and 11 months. */
function formatEmploymentDuration(
	startOn: string,
	endOn: string | null,
	language: FormattedDateLanguage = 'en',
) {
	const start = startOn.slice(0, 7)
	const end = (endOn ?? new Date().toISOString()).slice(0, 7)
	if (!/^\d{4}-\d{2}$/.test(start) || !/^\d{4}-\d{2}$/.test(end)) return ''

	const [startYear, startMonth] = start.split('-').map(Number)
	const [endYear, endMonth] = end.split('-').map(Number)
	const total = Math.max(
		0,
		(endYear - startYear) * 12 + (endMonth - startMonth) + 1,
	)
	const years = Math.floor(total / 12)
	const months = total % 12

	const parts: string[] = []

	if (language === 'ru') {
		if (years > 0) {
			parts.push(`${years} ${pluralRu(years, 'год', 'года', 'лет')}`)
		}
		if (months > 0) {
			parts.push(`${months} ${pluralRu(months, 'месяц', 'месяца', 'месяцев')}`)
		}

		return parts.join(' и ') || 'меньше месяца'
	}

	if (years > 0) {
		parts.push(`${years} ${pluralEn(years, 'year', 'years')}`)
	}
	if (months > 0) {
		parts.push(`${months} ${pluralEn(months, 'month', 'months')}`)
	}

	return parts.join(' & ') || 'less than a month'
}

export { formatEmploymentDuration }
