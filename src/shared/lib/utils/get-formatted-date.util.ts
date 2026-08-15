import { Temporal } from 'temporal-polyfill'

export type FormattedDateLanguage = 'ru' | 'en'

export type GetFormattedDateOptions = {
	includeTime?: boolean
	includeDay?: boolean
	language?: FormattedDateLanguage
}

type DatePrecision = 'year' | 'month' | 'day'

type FormatDate = {
	full: string
	short: string
	relative: string
}

const EMPTY: Record<FormattedDateLanguage, string> = {
	ru: 'Нет данных',
	en: 'No data',
}

function parseInstant(timestamp: number | string): {
	instant: Temporal.Instant
	precision: DatePrecision
} | null {
	try {
		if (typeof timestamp === 'number') {
			if (!timestamp || Number.isNaN(timestamp) || timestamp <= 0) return null
			return {
				instant: Temporal.Instant.fromEpochMilliseconds(timestamp),
				precision: 'day',
			}
		}

		const trimmed = timestamp.trim()
		if (!trimmed) return null

		if (/^\d+$/.test(trimmed)) {
			const n = Number(trimmed)
			if (!n || n <= 0) return null
			return {
				instant: Temporal.Instant.fromEpochMilliseconds(n),
				precision: 'day',
			}
		}

		let date = trimmed
		let precision: DatePrecision = 'day'

		if (/^\d{4}$/.test(date)) {
			date = `${date}-01-01`
			precision = 'year'
		} else if (/^\d{4}-\d{2}$/.test(date)) {
			date = `${date}-01`
			precision = 'month'
		}

		const iso = date.includes('T') ? date : `${date}T00:00:00Z`
		return { instant: Temporal.Instant.from(iso), precision }
	} catch {
		return null
	}
}

function resolveOptions(
	includeTimeOrOptions?: boolean | GetFormattedDateOptions,
	language?: FormattedDateLanguage,
): Required<GetFormattedDateOptions> {
	if (typeof includeTimeOrOptions === 'object' && includeTimeOrOptions) {
		return {
			includeTime: includeTimeOrOptions.includeTime ?? true,
			includeDay: includeTimeOrOptions.includeDay ?? true,
			language: includeTimeOrOptions.language ?? 'en',
		}
	}

	return {
		includeTime: includeTimeOrOptions ?? true,
		includeDay: true,
		language: language ?? 'en',
	}
}

function formatTime(
	zoned: Temporal.ZonedDateTime,
	language: FormattedDateLanguage,
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
	variant: 'full' | 'short' | 'month-day',
	precision: DatePrecision,
) {
	const locale = language === 'ru' ? 'ru-RU' : 'en-GB'
	const hour12 = language !== 'ru'
	const time =
		includeTime && precision === 'day'
			? ({ hour: 'numeric', minute: '2-digit', hour12 } as const)
			: {}

	if (precision === 'year') {
		return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
			instant.epochMilliseconds,
		)
	}

	if (precision === 'month') {
		if (variant === 'short') {
			const short = new Intl.DateTimeFormat(locale, {
				month: '2-digit',
				year: '2-digit',
			}).format(instant.epochMilliseconds)
			return language === 'en' ? short.replaceAll('/', '.') : short
		}

		return new Intl.DateTimeFormat(locale, {
			month: 'long',
			year: 'numeric',
		}).format(instant.epochMilliseconds)
	}

	if (variant === 'month-day') {
		return new Intl.DateTimeFormat(locale, {
			day: 'numeric',
			month: 'long',
			...time,
		}).format(instant.epochMilliseconds)
	}

	if (variant === 'full') {
		return new Intl.DateTimeFormat(locale, {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			...time,
		}).format(instant.epochMilliseconds)
	}

	const short = new Intl.DateTimeFormat(locale, {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		...time,
	}).format(instant.epochMilliseconds)

	return language === 'en' ? short.replaceAll('/', '.') : short
}

function getRelativeDate(
	zoned: Temporal.ZonedDateTime,
	language: FormattedDateLanguage,
	includeTime: boolean,
	precision: DatePrecision,
) {
	if (precision !== 'day') {
		return formatCalendarDate(
			zoned.toInstant(),
			language,
			false,
			precision === 'year' ? 'full' : 'month-day',
			precision,
		)
	}

	const timeZone = zoned.timeZoneId
	const dayDiff = zoned
		.toPlainDate()
		.until(Temporal.Now.plainDateISO(timeZone)).days
	const timeStr = includeTime ? formatTime(zoned, language) : ''
	const withTime = (label: string, connector: 'в' | 'at') =>
		includeTime ? `${label} ${connector} ${timeStr}` : label

	if (language === 'ru') {
		if (dayDiff === -1) return withTime('Завтра', 'в')
		if (dayDiff === 0) return withTime('Сегодня', 'в')
		if (dayDiff === 1) return withTime('Вчера', 'в')

		if (dayDiff < -1) {
			return formatCalendarDate(
				zoned.toInstant(),
				language,
				includeTime,
				'month-day',
				'day',
			)
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
		return formatCalendarDate(
			zoned.toInstant(),
			language,
			includeTime,
			'month-day',
			'day',
		)
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
	includeTimeOrOptions?: boolean | GetFormattedDateOptions,
	language?: FormattedDateLanguage,
): FormatDate {
	const options = resolveOptions(includeTimeOrOptions, language)
	const empty = EMPTY[options.language]
	const parsed = parseInstant(timestamp)

	if (!parsed) {
		return { full: empty, short: empty, relative: empty }
	}

	const precision =
		options.includeDay === false && parsed.precision === 'day'
			? 'month'
			: parsed.precision
	const includeTime = options.includeTime && precision === 'day'
	const zoned = parsed.instant.toZonedDateTimeISO(Temporal.Now.timeZoneId())

	return {
		full: formatCalendarDate(
			parsed.instant,
			options.language,
			includeTime,
			'full',
			precision,
		),
		short: formatCalendarDate(
			parsed.instant,
			options.language,
			includeTime,
			'short',
			precision,
		),
		relative: getRelativeDate(zoned, options.language, includeTime, precision),
	}
}

export { getFormattedDate }
