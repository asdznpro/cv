'use client'

import { LineChart as EChartsLineSeries } from 'echarts/charts'
import {
	DataZoomComponent,
	GridComponent,
	TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { motion, useReducedMotion } from 'motion/react'
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
} from 'react'
import { twMerge } from 'tailwind-merge'

import { Spinner } from 'ui/blocks'

import { ChartLegendOverlay } from '../legend'
import {
	DEFAULT_BRUSH_HEIGHT,
	syncBrushOverlay,
	type ChartBrushGeometry,
	type ChartBrushOverlayElements,
	type ChartBrushZoomRange,
} from '../brush'
import {
	buildChartCss,
	DEFAULT_ECHARTS_RENDERER,
	resolveColors,
	type ChartResolvedColors,
} from '../lib'
import {
	LOADING_ANIMATION_DURATION,
	LOADING_DEFAULT_POINTS,
	LOADING_SHIMMER_BAND,
	LOADING_STROKE_OPACITY,
	REVEAL_DURATION,
	REVEAL_PREFIX,
} from './cartesian.constants'
import {
	buildBrushFrame,
	buildChartLayout,
	buildLoadingOption,
	buildMainAxes,
	buildTooltipOption,
	getLoadingData,
	shimmerWindowStops,
	sliceFrom,
	sliceToNull,
	type CartesianOptionContext,
} from './cartesian.option'
import type {
	CartesianChartOption,
	CartesianChartProps,
	EChartsInstance,
} from './CartesianChart.interface'
import type { CartesianSeriesBase } from './cartesian.types'

echarts.use([
	EChartsLineSeries,
	GridComponent,
	TooltipComponent,
	DataZoomComponent,
])

type LiveState = {
	resolved: ChartResolvedColors | null
	hoveredKey: string | null
	hasRevealed: boolean
	revealEndsAt: number
	loadingRows: number[] | null
	categories: string[]
	dataLength: number
	plottedTops: Record<string, number[]>
	brushRange: ChartBrushZoomRange
	brushGeom: ChartBrushGeometry | null
	brushOverlay: ChartBrushOverlayElements | null
	brushHover: { inside: boolean; left: boolean; right: boolean }
	seriesKeyByIndex: (string | undefined)[]
	companionIdsByKey: Map<string, string[]>
	revealIndex: number | null
	revealValues: Record<string, unknown[]>
	handlers: {
		onBrushChange?: (range: { startIndex: number; endIndex: number }) => void
		onSelectionChange?: (key: string | null) => void
		clickableKeys: Set<string>
		selectedDataKey: string | null
		brushFormatLabel?: (value: string, index: number) => string
		seriesKeys: string[]
		enableHoverHighlight: boolean
		enableHoverReveal: boolean
	}
	repush: () => void
}

export function CartesianChart<
	TData extends Record<string, unknown>,
	TSeries extends CartesianSeriesBase,
>({
	data,
	config,
	renderer = DEFAULT_ECHARTS_RENDERER,
	xDataKey,
	className,
	curveType = 'linear',
	stackType = 'default',
	animation = true,
	animationType = 'left-to-right',
	enableHoverHighlight = false,
	enableHoverReveal = false,
	defaultSelectedDataKey = null,
	selectedDataKey: selectedDataKeyProp,
	onSelectionChange,
	isLoading = false,
	loadingPoints = LOADING_DEFAULT_POINTS,
	chartOptions,
	series,
	slots,
	adapter,
}: CartesianChartProps<TData, TSeries>) {
	const rawId = useId()
	const chartId = `chart-${rawId.replace(/:/g, '')}`

	const containerRef = useRef<HTMLDivElement>(null)
	const mountRef = useRef<HTMLDivElement>(null)
	const echartsRef = useRef<EChartsInstance | null>(null)

	const live = useRef<LiveState>({
		resolved: null,
		hoveredKey: null,
		hasRevealed: false,
		revealEndsAt: 0,
		loadingRows: null,
		categories: [],
		dataLength: 0,
		plottedTops: {},
		brushRange: { start: 0, end: 100 },
		brushGeom: null,
		brushOverlay: null,
		brushHover: { inside: false, left: false, right: false },
		seriesKeyByIndex: [],
		companionIdsByKey: new Map(),
		revealIndex: null,
		revealValues: {},
		handlers: {
			onBrushChange: undefined,
			onSelectionChange,
			clickableKeys: new Set<string>(),
			selectedDataKey: defaultSelectedDataKey,
			brushFormatLabel: undefined,
			seriesKeys: [],
			enableHoverHighlight,
			enableHoverReveal,
		},
		repush: () => {},
	}).current

	const loadingData = useCallback(() => {
		if (live.loadingRows === null) {
			live.loadingRows = getLoadingData(loadingPoints)
		}
		return live.loadingRows
	}, [live, loadingPoints])
	const shouldReduceMotion = useReducedMotion()

	const [internalSelectedKey, setSelectedDataKey] = useState<string | null>(
		defaultSelectedDataKey,
	)
	const selectedDataKey =
		selectedDataKeyProp !== undefined
			? selectedDataKeyProp
			: internalSelectedKey
	const [hoveredDataKey, setHoveredDataKey] = useState<string | null>(null)

	const {
		xAxis: xAxisSlot,
		yAxis: yAxisSlot,
		showGrid,
		tooltip: tooltipSlot,
		legend: legendSlot,
		brush: brushSlot,
	} = slots

	const showBrush = brushSlot.present
	const brushHeight = brushSlot.height ?? DEFAULT_BRUSH_HEIGHT
	const seriesKeys = useMemo(() => series.map(item => item.dataKey), [series])
	const isExpanded = stackType === 'expanded'
	const isStacked = stackType === 'stacked' || isExpanded

	const xCategoryKey = useMemo(() => {
		if (xAxisSlot.dataKey) return xAxisSlot.dataKey
		if (xDataKey) return xDataKey as string
		const firstRow = data[0]
		if (firstRow) {
			const claimed = new Set(seriesKeys)
			const found = Object.keys(firstRow).find(key => !claimed.has(key))
			if (found) return found
		}
		return ''
	}, [xAxisSlot.dataKey, xDataKey, data, seriesKeys])

	const effectiveAnimation = series[0]?.animationType ?? animationType
	const css = useMemo(() => buildChartCss(chartId, config), [chartId, config])
	const hasSelection = selectedDataKey !== null
	const clickableKeys = useMemo(
		() =>
			new Set(
				series.filter(item => item.isClickable).map(item => item.dataKey),
			),
		[series],
	)

	live.handlers = {
		onBrushChange: brushSlot.onChange,
		onSelectionChange,
		clickableKeys,
		selectedDataKey,
		brushFormatLabel: brushSlot.formatLabel,
		seriesKeys,
		enableHoverHighlight,
		enableHoverReveal,
	}
	live.dataLength = data.length

	const toggleSelection = useCallback(
		(key: string) => {
			if (live.hoveredKey !== null) {
				const chart = echartsRef.current
				const companions = chart
					? live.companionIdsByKey.get(live.hoveredKey)
					: undefined
				if (chart && companions) {
					for (const seriesId of companions) {
						chart.dispatchAction({ type: 'downplay', seriesId })
					}
				}
				live.hoveredKey = null
				setHoveredDataKey(null)
			}
			const next = live.handlers.selectedDataKey === key ? null : key
			setSelectedDataKey(next)
			live.handlers.onSelectionChange?.(next)
		},
		[live],
	)

	const syncBrushOverlayNow = useCallback(() => {
		const chart = echartsRef.current
		if (!chart) return

		const geom = live.brushGeom
		const tokens = live.resolved?.tokens
		if (!geom || !tokens) {
			syncBrushOverlay(chart, live, null)
			return
		}

		const range = live.brushRange
		const categories = live.categories
		const format = live.handlers.brushFormatLabel
		const lastIndex = Math.max(categories.length - 1, 0)
		const startIndex = Math.round((range.start / 100) * lastIndex)
		const endIndex = Math.round((range.end / 100) * lastIndex)
		const labels =
			format && categories.length
				? {
						start: format(categories[startIndex] ?? '', startIndex),
						end: format(categories[endIndex] ?? '', endIndex),
					}
				: null

		syncBrushOverlay(chart, live, {
			range,
			geom,
			size: { width: chart.getWidth(), height: chart.getHeight() },
			tokens,
			labels,
			showLabels: live.brushHover.inside,
			hover: live.brushHover,
		})
	}, [live])

	const adapterRef = useRef(adapter)
	adapterRef.current = adapter

	const buildOption = useCallback((): CartesianChartOption => {
		const resolved = live.resolved
		if (!resolved) return {}

		const categories = data.map(row => String(row[xCategoryKey]))
		live.categories = categories

		const revealSink: Record<string, unknown[]> = {}
		const currentAdapter = adapterRef.current

		const ctx = {
			data,
			config,
			series,
			curveType,
			isStacked,
			isExpanded,
			selectedDataKey,
			hasSelection,
			showGrid,
			xAxisSlot,
			yAxisSlot,
			tooltipSlot,
			legendSlot,
			isLoading,
			loadingData,
			showBrush,
			brushHeight,
			enableHoverHighlight,
			enableHoverReveal,
			revealIndex: live.revealIndex,
			revealSink,
			resolved,
			rendererSize: {
				width:
					echartsRef.current?.getWidth() ?? mountRef.current?.clientWidth ?? 0,
				height:
					echartsRef.current?.getHeight() ??
					mountRef.current?.clientHeight ??
					0,
			},
			categories,
			brushRange: live.brushRange,
			getHoveredKey: () => live.hoveredKey,
		} as CartesianOptionContext<TSeries>

		if (currentAdapter.computePlottedTops) {
			live.plottedTops = currentAdapter.computePlottedTops(ctx)
		}

		const { grid, brushBottom } = buildChartLayout(ctx)
		live.brushGeom = showBrush
			? { bottom: brushBottom, height: brushHeight }
			: null

		const { xAxis, yAxis } = buildMainAxes(ctx)

		if (isLoading) {
			return buildLoadingOption(
				ctx,
				{ grid, xAxis, yAxis },
				currentAdapter.loadingSeriesExtra?.(ctx),
			)
		}

		const brush = showBrush
			? {
					...buildBrushFrame(ctx, brushBottom),
					miniSeries: currentAdapter.buildBrushMiniSeries(ctx),
				}
			: null

		const builtSeries = [
			...currentAdapter.buildSeries(ctx),
			...(brush?.miniSeries ?? []),
		]
		if (enableHoverReveal) live.revealValues = revealSink

		live.seriesKeyByIndex = builtSeries.map(item => {
			const id = String(item.id ?? '')
			return id && !id.startsWith('__') ? id : undefined
		})

		const companionIdsByKey = new Map<string, string[]>()
		for (const item of series) {
			const ids = currentAdapter.companionIds(item, {
				dataLength: data.length,
				enableHoverReveal,
			})
			if (ids.length) companionIdsByKey.set(item.dataKey, ids)
		}
		live.companionIdsByKey = companionIdsByKey

		return {
			animation: false,
			grid: brush ? [grid, brush.miniGrid] : grid,
			xAxis: brush ? [xAxis, brush.miniXAxis] : xAxis,
			yAxis: brush ? [yAxis, brush.miniYAxis] : yAxis,
			tooltip: buildTooltipOption(ctx),
			dataZoom: brush?.dataZoom,
			series: builtSeries,
		}
	}, [
		live,
		data,
		config,
		series,
		xCategoryKey,
		curveType,
		isStacked,
		isExpanded,
		selectedDataKey,
		hasSelection,
		showGrid,
		xAxisSlot,
		yAxisSlot,
		tooltipSlot,
		legendSlot,
		isLoading,
		loadingData,
		showBrush,
		brushHeight,
		enableHoverHighlight,
		enableHoverReveal,
	])

	// biome-ignore lint/correctness/useExhaustiveDependencies: init effect reads live ref imperatively
	useEffect(() => {
		const mount = mountRef.current
		const container = containerRef.current
		if (!mount || !container) return

		live.hoveredKey = null
		live.revealIndex = null
		live.brushHover = { inside: false, left: false, right: false }
		setHoveredDataKey(null)

		const chart = echarts.init(mount, null, { renderer })
		echartsRef.current = chart

		const resizeObserver = new ResizeObserver(() => {
			if (
				mount.clientWidth === chart.getWidth() &&
				mount.clientHeight === chart.getHeight()
			) {
				return
			}
			chart.resize()
			live.repush()
		})
		resizeObserver.observe(mount)

		const themeObserver = new MutationObserver(() => {
			live.repush()
		})
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		})

		chart.on('click', params => {
			const { clickableKeys: clickable, seriesKeys: keys } = live.handlers
			const p = params as {
				seriesId?: string
				seriesIndex?: number
				event?: { offsetX?: number; offsetY?: number }
			}
			let id =
				p.seriesId ??
				(typeof p.seriesIndex === 'number'
					? live.seriesKeyByIndex[p.seriesIndex]
					: undefined)
			const resolveKey = adapterRef.current.resolvePointerKey
			if (
				resolveKey &&
				typeof p.event?.offsetX === 'number' &&
				typeof p.event?.offsetY === 'number'
			) {
				const resolved = resolveKey(
					chart,
					live.plottedTops,
					keys,
					p.event.offsetX,
					p.event.offsetY,
				)
				if (resolved) id = resolved
			}
			if (typeof id === 'string' && clickable.has(id)) toggleSelection(id)
		})

		const applyHoverKey = (key: string | null) => {
			if (live.hoveredKey === key) return
			const previous = live.hoveredKey
			live.hoveredKey = key
			setHoveredDataKey(key)
			if (previous) {
				chart.dispatchAction({ type: 'downplay', seriesId: previous })
				for (const id of live.companionIdsByKey.get(previous) ?? []) {
					chart.dispatchAction({ type: 'downplay', seriesId: id })
				}
			}
			if (key) {
				chart.dispatchAction({ type: 'highlight', seriesId: key })
				for (const id of live.companionIdsByKey.get(key) ?? []) {
					chart.dispatchAction({ type: 'highlight', seriesId: id })
				}
			}
		}

		chart.on('mouseover', params => {
			const { enableHoverHighlight: hoverOn, enableHoverReveal: revealOn } =
				live.handlers
			if (!hoverOn || revealOn) return
			if (live.handlers.selectedDataKey !== null) return
			const p = params as {
				seriesId?: string
				seriesIndex?: number
				componentType?: string
			}
			if (p.componentType !== 'series') return
			const id =
				p.seriesId ??
				(typeof p.seriesIndex === 'number'
					? live.seriesKeyByIndex[p.seriesIndex]
					: undefined)
			if (typeof id !== 'string' || id.startsWith('__')) return

			if (adapterRef.current.hoverMode === 'band') {
				if (id !== live.hoveredKey) {
					chart.dispatchAction({ type: 'downplay', seriesIndex: p.seriesIndex })
					if (live.hoveredKey) {
						chart.dispatchAction({
							type: 'highlight',
							seriesId: live.hoveredKey,
						})
					}
				}
				return
			}

			live.hoveredKey = id
			setHoveredDataKey(id)
			const companions = live.companionIdsByKey.get(id)
			if (companions) {
				for (const seriesId of companions) {
					chart.dispatchAction({ type: 'highlight', seriesId })
				}
			}
		})

		chart.on('mouseout', () => {
			if (adapterRef.current.hoverMode === 'band') return
			const prev = live.hoveredKey
			if (prev === null) return
			live.hoveredKey = null
			setHoveredDataKey(null)
			const companions = live.companionIdsByKey.get(prev)
			if (companions) {
				for (const seriesId of companions) {
					chart.dispatchAction({ type: 'downplay', seriesId })
				}
			}
		})

		const zrHover = chart.getZr()
		const pushReveal = (idx: number | null) => {
			const keys = live.handlers.seriesKeys
			const on = idx !== null
			chart.setOption(
				{
					series: keys.flatMap(key => [
						{
							id: key,
							data: on
								? sliceToNull(live.revealValues[key] ?? [], idx)
								: (live.revealValues[key] ?? []),
						},
						{
							id: `${REVEAL_PREFIX}${key}`,
							data: on
								? sliceFrom(live.revealValues[key] ?? [], idx)
								: (live.revealValues[key] ?? []),
							lineStyle: { opacity: on ? 0.3 : 0 },
						},
					]),
				},
				{ silent: true },
			)
			for (const key of keys) {
				chart.dispatchAction(
					on
						? { type: 'highlight', seriesId: key, dataIndex: idx as number }
						: { type: 'downplay', seriesId: key },
				)
			}
		}
		const clearReveal = () => {
			if (live.revealIndex === null) return
			live.revealIndex = null
			pushReveal(null)
		}
		const applyReveal = (event: { offsetX?: number; offsetY?: number }) => {
			const len = live.dataLength
			if (len < 1) return
			const x = event.offsetX ?? -1
			const y = event.offsetY ?? -1
			if (!chart.containPixel({ gridIndex: 0 }, [x, y])) {
				clearReveal()
				return
			}
			const raw = chart.convertFromPixel({ gridIndex: 0 }, [x, y])[0]
			const idx = Math.max(0, Math.min(len - 1, Math.round(raw)))
			if (idx === live.revealIndex) return
			live.revealIndex = idx
			pushReveal(idx)
		}
		const onZrHoverMove = (event: { offsetX?: number; offsetY?: number }) => {
			if (live.handlers.enableHoverReveal) {
				applyReveal(event)
				return
			}
			if (adapterRef.current.hoverMode !== 'band') return
			if (!live.handlers.enableHoverHighlight) return
			if (live.handlers.selectedDataKey !== null) return
			const resolveKey = adapterRef.current.resolvePointerKey
			if (!resolveKey) return
			applyHoverKey(
				resolveKey(
					chart,
					live.plottedTops,
					live.handlers.seriesKeys,
					event.offsetX ?? -1,
					event.offsetY ?? -1,
				),
			)
		}
		const onZrHoverOut = () => {
			if (live.handlers.enableHoverReveal) clearReveal()
			else if (
				adapterRef.current.hoverMode === 'band' &&
				live.handlers.enableHoverHighlight
			) {
				applyHoverKey(null)
			}
		}
		zrHover.on('mousemove', onZrHoverMove)
		zrHover.on('globalout', onZrHoverOut)

		chart.on('datazoom', () => {
			const option = chart.getOption() as {
				dataZoom?: { start?: number; end?: number }[]
			}
			const zoom = option.dataZoom?.[0]
			if (!zoom) return

			live.brushRange = { start: zoom.start ?? 0, end: zoom.end ?? 100 }
			syncBrushOverlayNow()

			const { onBrushChange: onChange } = live.handlers
			if (!onChange) return
			const len = live.dataLength
			const startIndex = Math.round(((zoom.start ?? 0) / 100) * (len - 1))
			const endIndex = Math.round(((zoom.end ?? 100) / 100) * (len - 1))
			onChange({ startIndex, endIndex })
		})

		const zr = chart.getZr()
		const applyHover = (next: {
			inside: boolean
			left: boolean
			right: boolean
		}) => {
			const prev = live.brushHover
			if (
				prev.inside === next.inside &&
				prev.left === next.left &&
				prev.right === next.right
			) {
				return
			}
			live.brushHover = next
			syncBrushOverlayNow()
		}
		const onZrMove = (event: { offsetX?: number; offsetY?: number }) => {
			const geom = live.brushGeom
			if (!geom) return
			const x = event.offsetX ?? -1
			const y = event.offsetY ?? -1
			const top = chart.getHeight() - geom.bottom - geom.height
			const inside = y >= top - 4 && y <= top + geom.height + 4
			const trackLeft = 8
			const trackWidth = Math.max(chart.getWidth() - 16, 1)
			const { start, end } = live.brushRange
			const selectionLeft = trackLeft + (trackWidth * start) / 100
			const selectionRight = trackLeft + (trackWidth * end) / 100
			applyHover({
				inside,
				left: inside && Math.abs(x - selectionLeft) <= 8,
				right: inside && Math.abs(x - selectionRight) <= 8,
			})
		}
		const onZrOut = () =>
			applyHover({ inside: false, left: false, right: false })
		zr.on('mousemove', onZrMove)
		zr.on('globalout', onZrOut)

		return () => {
			zrHover.off('mousemove', onZrHoverMove)
			zrHover.off('globalout', onZrHoverOut)
			zr.off('mousemove', onZrMove)
			zr.off('globalout', onZrOut)
			resizeObserver.disconnect()
			themeObserver.disconnect()
			chart.dispose()
			echartsRef.current = null
			live.brushOverlay = null
			live.hasRevealed = false
		}
	}, [renderer, syncBrushOverlayNow, toggleSelection])

	// biome-ignore lint/correctness/useExhaustiveDependencies: renderer listed for sync with init effect
	useEffect(() => {
		const chart = echartsRef.current
		const container = containerRef.current
		if (!chart || !container) return

		live.resolved = resolveColors(container, config, seriesKeys)

		const push = (withEntrance: boolean) => {
			const option = buildOption()
			const merged = chartOptions ? { ...option, ...chartOptions } : option
			Object.assign(merged, {
				animation: withEntrance,
				animationDuration: REVEAL_DURATION,
				animationDurationUpdate: 0,
			})
			chart.setOption(merged as CartesianChartOption, { notMerge: true })
			syncBrushOverlayNow()
		}

		if (isLoading) live.hasRevealed = false
		const shouldReveal = !live.hasRevealed && !isLoading
		if (shouldReveal) live.hasRevealed = true
		const revealEnabled =
			animation &&
			shouldReveal &&
			effectiveAnimation !== 'none' &&
			!shouldReduceMotion
		if (revealEnabled) live.revealEndsAt = performance.now() + REVEAL_DURATION
		push(revealEnabled)

		live.repush = () => {
			live.resolved = resolveColors(container, config, seriesKeys)
			push(false)
		}
	}, [
		renderer,
		live,
		buildOption,
		chartOptions,
		isLoading,
		animation,
		effectiveAnimation,
		shouldReduceMotion,
		config,
		seriesKeys,
		syncBrushOverlayNow,
	])

	// biome-ignore lint/correctness/useExhaustiveDependencies: renderer switch re-inits chart in sibling effect
	useEffect(() => {
		const chart = echartsRef.current
		if (!chart || isLoading) return
		const animatedKeys = series
			.filter(
				item =>
					item.strokeVariant === 'animated-dashed' && !item.enableBufferLine,
			)
			.map(item => item.dataKey)
		if (animatedKeys.length === 0 || hasSelection) return

		let raf = 0
		let delayTimer: ReturnType<typeof setTimeout> | undefined
		const begin = () => {
			const loopStart = performance.now()
			const tick = (now: number) => {
				const offset = -(((now - loopStart) / 1000) % 1) * 6
				chart.setOption(
					{
						series: animatedKeys.map(id => ({
							id,
							lineStyle: { dashOffset: offset },
						})),
					},
					{ silent: true, lazyUpdate: true },
				)
				raf = requestAnimationFrame(tick)
			}
			raf = requestAnimationFrame(tick)
		}

		const delay = Math.max(0, live.revealEndsAt - performance.now())
		if (delay > 0) delayTimer = setTimeout(begin, delay + 50)
		else begin()

		return () => {
			if (delayTimer !== undefined) clearTimeout(delayTimer)
			cancelAnimationFrame(raf)
		}
	}, [renderer, live, series, hasSelection, isLoading])

	// biome-ignore lint/correctness/useExhaustiveDependencies: renderer switch re-inits chart in sibling effect
	useEffect(() => {
		const chart = echartsRef.current
		if (!chart || !isLoading) return

		let raf = 0
		let lastPhase = 0
		const start = performance.now()
		const tick = (now: number) => {
			const phase = ((((now - start) / LOADING_ANIMATION_DURATION) % 1) + 1) % 1
			if (phase < lastPhase) live.loadingRows = getLoadingData(loadingPoints)
			lastPhase = phase

			const foreground =
				live.resolved?.tokens.foreground ?? 'rgba(120, 120, 120, 1)'
			const w = chart.getWidth()
			const h = chart.getHeight()
			if (!w || !h) {
				raf = requestAnimationFrame(tick)
				return
			}
			const maxT = (w + h) / (2 * w)
			const center =
				phase * (maxT + 2 * LOADING_SHIMMER_BAND) - LOADING_SHIMMER_BAND
			const clip = (peak: number) =>
				new echarts.graphic.LinearGradient(
					0,
					0,
					w,
					w,
					shimmerWindowStops(center, foreground, peak),
					true,
				)
			chart.setOption(
				{
					series: [
						{
							id: '__loading',
							data: loadingData(),
							lineStyle: {
								color: clip(LOADING_STROKE_OPACITY),
								width: 1,
							},
							...adapterRef.current.loadingShimmerExtra?.(clip),
						},
					],
				},
				{ silent: true, lazyUpdate: true },
			)
			raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [renderer, live, isLoading, loadingPoints, loadingData])

	const legendStyle: CSSProperties = {
		position: 'absolute',
		left: 16,
		right: 16,
		pointerEvents: 'auto',
		...(legendSlot.verticalAlign === 'top'
			? { top: 12 }
			: legendSlot.verticalAlign === 'bottom'
				? { bottom: showBrush ? brushHeight + 16 : 12 }
				: { top: '50%', transform: 'translateY(-50%)' }),
	}

	return (
		<div
			ref={containerRef}
			data-chart={chartId}
			className={twMerge('relative flex flex-col text-xs', className)}
		>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: chart CSS variables from config */}
			<style dangerouslySetInnerHTML={{ __html: css }} />

			<div className='relative min-h-0 w-full flex-1'>
				<div ref={mountRef} className='h-full min-h-0 w-full' />
			</div>

			{legendSlot.present && !isLoading && (
				<ChartLegendOverlay
					seriesKeys={seriesKeys}
					config={config}
					variant={legendSlot.variant}
					align={legendSlot.align}
					verticalAlign={legendSlot.verticalAlign}
					selectedKey={selectedDataKey}
					hoveredKey={hoveredDataKey}
					isClickable={legendSlot.isClickable}
					onToggle={toggleSelection}
					style={legendStyle}
				/>
			)}

			{isLoading && (
				<div className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center'>
					<motion.div
						initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.25, ease: 'easeOut' }}
						className='text-foreground bg-surface border border-separator rounded-md px-2 py-0.5 text-sm font-condensed flex items-center gap-2'
					>
						<Spinner size={16} />
						<span>Loading</span>
					</motion.div>
				</div>
			)}
		</div>
	)
}
