'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import {
	DEFAULT_SHORTENER_STATS_RANGE,
	listShortenerStats,
	SHORTENER_STATS_RANGE_LABELS,
	SHORTENER_STATS_RANGES,
	type ShortenerStats,
	type ShortenerStatsRange,
} from 'lib/short-links'

import { Badge, Button, Separator, Spinner } from 'ui/blocks'
import { AreaChart, type ChartConfig } from 'ui/charts'
import { DropdownMenu, Tooltip } from 'ui/floating'

import {
	Icon28CalendarOutline,
	Icon28ChevronDownOutline,
	Icon28ChevronUpOutline,
	Icon28DoneOutline,
} from '@vkontakte/icons'

type ShortenerStatsDialogProps = {
	onClose: () => void
}

const CHART_CONFIG = {
	clicks: {
		label: 'Clicks',
		colors: ['hsla(240, 84%, 60%, 1)'],
	},
	visitors: {
		label: 'Visitors',
		colors: ['hsla(136, 84%, 60%, 1)'],
	},
} satisfies ChartConfig

const RANGE_COPY: Record<ShortenerStatsRange, string> = {
	day: 'Hourly traffic across every short link',
	week: 'Daily traffic across every short link',
	month: 'Daily traffic across every short link',
}

const RANGE_COMPARE: Record<ShortenerStatsRange, string> = {
	day: 'Compared with the previous day',
	week: 'Compared with the previous week',
	month: 'Compared with the previous month',
}

function formatChange(current: number, previous: number) {
	const delta = current - previous

	if (previous === 0) {
		if (delta === 0) {
			return { label: '0%', appearance: 'neutral' as const, up: false }
		}

		return {
			label: `+${delta.toLocaleString('en-US')}`,
			appearance: 'success' as const,
			up: true,
		}
	}

	const percent = Math.round((delta / previous) * 100)
	if (percent === 0) {
		return { label: '0%', appearance: 'neutral' as const, up: false }
	}

	const up = percent > 0
	return {
		label: `${up ? '+' : ''}${percent}%`,
		appearance: up ? ('success' as const) : ('danger' as const),
		up,
	}
}

function sortItemProps(active: boolean) {
	return {
		mode: (active ? 'secondary' : 'ghost') as 'secondary' | 'ghost',
		suffix: (
			<Icon28DoneOutline
				className={twMerge(!active && 'opacity-0 group-hover:opacity-strong')}
				width={18}
				height={18}
			/>
		),
	}
}

function loadingPointsFor(range: ShortenerStatsRange) {
	if (range === 'day') return 24
	if (range === 'week') return 7
	return 30
}

function StatsChange({
	current,
	previous,
	range,
}: {
	current: number
	previous: number
	range: ShortenerStatsRange
}) {
	const change = formatChange(current, previous)
	const Icon = change.up ? Icon28ChevronUpOutline : Icon28ChevronDownOutline

	return (
		<Tooltip text={RANGE_COMPARE[range]}>
			<Badge
				className='ml-1 mb-1 align-middle'
				size='sm'
				mode='soft'
				appearance={change.appearance}
				prefix={
					change.label === '0%' ? undefined : <Icon width={14} height={14} />
				}
			>
				{change.label}
			</Badge>
		</Tooltip>
	)
}

function formatTick(
	label: string,
	index: number,
	total: number,
	range: ShortenerStatsRange,
) {
	if (range === 'week') return label
	if (range === 'day') return index % 4 === 0 ? label : ''

	const step = Math.max(1, Math.ceil((total - 1) / 6))
	return index % step === 0 || index === total - 1 ? label : ''
}

export function ShortenerStatsDialog({ onClose }: ShortenerStatsDialogProps) {
	const [range, setRange] = useState<ShortenerStatsRange>(
		DEFAULT_SHORTENER_STATS_RANGE,
	)
	const [stats, setStats] = useState<ShortenerStats | null>(null)
	const points = stats?.range === range ? stats.points : []
	const loading = stats?.range !== range

	useEffect(() => {
		let cancelled = false

		void listShortenerStats(range).then(result => {
			if (cancelled) return

			if (!result.ok) {
				toast.error(result.error)
				setStats({
					range,
					points: [],
					clicks: 0,
					visitors: 0,
					previousClicks: 0,
					previousVisitors: 0,
				})
				return
			}

			setStats(result.stats)
		})

		return () => {
			cancelled = true
		}
	}, [range])

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface overflow-hidden'>
			<div className='h-12 flex items-center px-surface gap-surface'>
				<span className='flex-1 text-foreground-secondary text-sm truncate'>
					{RANGE_COPY[range]}
				</span>

				<DropdownMenu>
					<DropdownMenu.Trigger>
						<Button
							type='button'
							size='sm'
							mode='secondary'
							appearance='neutral'
							prefix={<Icon28CalendarOutline width={16} height={16} />}
						>
							{SHORTENER_STATS_RANGE_LABELS[range]}
						</Button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content className='w-40'>
						<DropdownMenu.Box>
							<DropdownMenu.Heading>Time range</DropdownMenu.Heading>

							{SHORTENER_STATS_RANGES.map(value => (
								<DropdownMenu.Item
									key={value}
									aria-label={SHORTENER_STATS_RANGE_LABELS[value]}
									onClick={() => setRange(value)}
									{...sortItemProps(range === value)}
								>
									{SHORTENER_STATS_RANGE_LABELS[value]}
								</DropdownMenu.Item>
							))}
						</DropdownMenu.Box>
					</DropdownMenu.Content>
				</DropdownMenu>
			</div>

			<Separator />

			<div className='flex flex-col bg-background'>
				<div className='flex p-surface gap-surface'>
					<div className='w-full grid @2xs:grid-cols-2 @lg:grid-cols-3 gap-app'>
						<div className='flex flex-col gap-2'>
							{loading ? (
								<Spinner size={28} className='my-1 text-foreground-secondary' />
							) : (
								<span className='text-3xl font-medium font-condensed tracking-tight tabular-nums'>
									{(stats?.clicks ?? 0).toLocaleString('en-US')}{' '}
									<StatsChange
										current={stats?.clicks ?? 0}
										previous={stats?.previousClicks ?? 0}
										range={range}
									/>
								</span>
							)}

							<span className='text-foreground-secondary text-xs'>Clicks</span>
						</div>

						<div className='flex flex-col gap-2'>
							{loading ? (
								<Spinner size={28} className='my-1 text-foreground-secondary' />
							) : (
								<span className='text-3xl font-medium font-condensed tracking-tight tabular-nums'>
									{(stats?.visitors ?? 0).toLocaleString('en-US')}{' '}
									<StatsChange
										current={stats?.visitors ?? 0}
										previous={stats?.previousVisitors ?? 0}
										range={range}
									/>
								</span>
							)}

							<span className='text-foreground-secondary text-xs'>
								Unique visitors
							</span>
						</div>
					</div>
				</div>

				<AreaChart
					data={points}
					config={CHART_CONFIG}
					xDataKey='label'
					className='h-40 w-full'
					curveType='smooth'
					isLoading={loading}
					loadingPoints={loadingPointsFor(range)}
					enableHoverReveal
					chartOptions={{
						grid: {
							left: 0,
							right: 0,
							top: 10,
							bottom: 0,
							containLabel: false,
						},
					}}
				>
					<AreaChart.Tooltip />

					<AreaChart.Area
						dataKey='clicks'
						variant='solid'
						strokeVariant='solid'
						strokeWidth={1.5}
					>
						<AreaChart.Dot variant='default' />
						<AreaChart.ActiveDot variant='ping' />
					</AreaChart.Area>

					<AreaChart.Area
						dataKey='visitors'
						variant='hatched'
						strokeVariant='solid'
						strokeWidth={1.5}
					>
						<AreaChart.Dot variant='default' />
						<AreaChart.ActiveDot variant='ping' />
					</AreaChart.Area>
				</AreaChart>
			</div>

			{/* <Separator />

			<div className='flex justify-end p-surface gap-surface'>
				<Button
					size='sm'
					type='button'
					mode='secondary'
					appearance='neutral'
					onClick={onClose}
				>
					Close
				</Button>
			</div> */}
		</div>
	)
}
