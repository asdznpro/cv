import { Temporal } from 'temporal-polyfill'

export type FormattedDateLanguage = 'ru' | 'en'

type FormatDate = {
	full: string
	short: string
	relative: string
}

const EMPTY: Record<FormattedDateLanguage, string> = {
	ru: 'Нет данных',
	en: 'No data',
}

function parseInstant(timestamp: number | string): Temporal.Instant | null {
	try {
		if (typeof timestamp === 'number') {
			if (!timestamp || Number.isNaN(timestamp) || timestamp <= 0) return null
			return Temporal.Instant.fromEpochMilliseconds(timestamp)
		}

		const trimmed = timestamp.trim()
		if (!trimmed) return null

		if (/^\d+$/.test(trimmed)) {
			const n = Number(trimmed)
			if (!n || n <= 0) return null
			return Temporal.Instant.fromEpochMilliseconds(n)
		}

		const iso = trimmed.includes('T') ? trimmed : `${trimmed}T00:00:00Z`
		return Temporal.Instant.from(iso)
	} catch {
		return null
	}
}

function formatTime(
	zoned: Temporal.ZonedDateTime,
	language: FormattedDateLanguage
) {
	if (language === 'ru') {
		return `${String(zoned.hour).padStart(2, '0')}:${String(zoned.minute).padStart(2, '0')}`
	}

	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}).format(zoned.epochMilliseconds)
}

function formatCalendarDate(
	instant: Temporal.Instant,
	language: FormattedDateLanguage,
	includeTime: boolean,
	variant: 'full' | 'short' | 'month-day'
) {
	const locale = language === 'ru' ? 'ru-RU' : 'en-US'
	const hour12 = language !== 'ru'

	if (variant === 'month-day') {
		return new Intl.DateTimeFormat(locale, {
			day: 'numeric',
			month: 'long',
			...(includeTime
				? { hour: 'numeric', minute: '2-digit', hour12 }
				: {}),
		}).format(instant.epochMilliseconds)
	}

	if (variant === 'full') {
		return new Intl.DateTimeFormat(locale, {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			...(includeTime
				? { hour: 'numeric', minute: '2-digit', hour12 }
				: {}),
		}).format(instant.epochMilliseconds)
	}

	const short = new Intl.DateTimeFormat(locale, {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		...(includeTime
			? { hour: 'numeric', minute: '2-digit', hour12 }
			: {}),
	}).format(instant.epochMilliseconds)

	return language === 'en' ? short.replaceAll('/', '.') : short
}

function getRelativeDate(
	zoned: Temporal.ZonedDateTime,
	language: FormattedDateLanguage,
	includeTime: boolean
) {
	const timeZone = zoned.timeZoneId
	const dayDiff = zoned.toPlainDate().until(Temporal.Now.plainDateISO(timeZone))
		.days
	const timeStr = includeTime ? formatTime(zoned, language) : ''
	const withTime = (label: string, connector: 'в' | 'at') =>
		includeTime ? `${label} ${connector} ${timeStr}` : label

	if (language === 'ru') {
		if (dayDiff === -1) return withTime('Завтра', 'в')
		if (dayDiff === 0) return withTime('Сегодня', 'в')
		if (dayDiff === 1) return withTime('Вчера', 'в')

		if (dayDiff < -1) {
			return formatCalendarDate(zoned.toInstant(), language, includeTime, 'month-day')
		}

		if (dayDiff === 2) return withTime('Позавчера', 'в')
		if (dayDiff <= 4) return withTime(`${dayDiff} дня назад`, 'в')
		if (dayDiff <= 6) return withTime(`${dayDiff} дней назад`, 'в')
		if (dayDiff <= 13) return 'Неделю назад'
		if (dayDiff <= 27) {
			return withTime(`${Math.ceil(dayDiff / 7)} недели назад`, 'в')
		}
		if (dayDiff <= 45) return 'Месяц назад'
		if (dayDiff <= 345) {
			return withTime(`${Math.ceil(dayDiff / 30)} месяцев назад`, 'в')
		}
		if (dayDiff <= 545) return 'Год назад'
		if (dayDiff <= 1460) {
			return withTime(`${Math.ceil(dayDiff / 365)} года назад`, 'в')
		}

		return withTime(`${Math.ceil(dayDiff / 365)} лет назад`, 'в')
	}

	if (dayDiff === -1) return withTime('Tomorrow', 'at')
	if (dayDiff === 0) return withTime('Today', 'at')
	if (dayDiff === 1) return withTime('Yesterday', 'at')

	if (dayDiff < -1) {
		return formatCalendarDate(zoned.toInstant(), language, includeTime, 'month-day')
	}

	if (dayDiff === 2) return withTime('2 days ago', 'at')
	if (dayDiff <= 6) return withTime(`${dayDiff} days ago`, 'at')
	if (dayDiff <= 13) return 'A week ago'
	if (dayDiff <= 27) {
		return withTime(`${Math.ceil(dayDiff / 7)} weeks ago`, 'at')
	}
	if (dayDiff <= 45) return 'A month ago'
	if (dayDiff <= 345) {
		return withTime(`${Math.ceil(dayDiff / 30)} months ago`, 'at')
	}
	if (dayDiff <= 545) return 'A year ago'

	return withTime(`${Math.ceil(dayDiff / 365)} years ago`, 'at')
}

function getFormattedDate(
	timestamp: number | string,
	includeTime: boolean = true,
	language: FormattedDateLanguage = 'en'
): FormatDate {
	const empty = EMPTY[language]
	const instant = parseInstant(timestamp)

	if (!instant) {
		return { full: empty, short: empty, relative: empty }
	}

	const zoned = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId())

	return {
		full: formatCalendarDate(instant, language, includeTime, 'full'),
		short: formatCalendarDate(instant, language, includeTime, 'short'),
		relative: getRelativeDate(zoned, language, includeTime),
	}
}

export { getFormattedDate }
