'use client'

import React, {
	useState,
	useEffect,
	useLayoutEffect,
	useRef,
	useMemo,
} from 'react'
import type { EmblaCarouselType } from 'embla-carousel'

import { twMerge } from 'tailwind-merge'

import type TabsProps from './Tabs.interface'
import type TabItemProps from './tab-item/TabItem.interface'

import { useOverflow, Carousel } from 'ui/blocks'

import { TabItem } from './tab-item'

type TabItemComponent = React.FC<TabItemProps>

interface TabsComponent {
	(props: TabsProps): React.JSX.Element
	displayName?: string
	Item: TabItemComponent
}

function TabsRoot(props: TabsProps) {
	const {
		children,
		onTabSelect,
		initialIndex = 0,
		className,
		...restProps
	} = props

	const viewportRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	const overflowing = useOverflow(viewportRef, contentRef)

	const carouselOptions = useMemo(
		() => ({
			align: 'center' as const,
			containScroll: 'trimSnaps' as const,
			dragFree: true,
			slides: '[data-tab-slide]',
			watchDrag: (api: EmblaCarouselType) =>
				api.canScrollPrev() || api.canScrollNext(),
		}),
		[],
	)

	const [selectedIndex, setSelectedIndex] = useState(initialIndex)
	const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({})
	const [revealed, setRevealed] = useState(false)

	const tabsRef = useRef<HTMLDivElement>(null)

	const handleSelect = (index: number) => {
		setSelectedIndex(index)

		if ('vibrate' in navigator) {
			navigator.vibrate(10)
		}

		if (onTabSelect) {
			onTabSelect(index)
		}
	}

	useEffect(() => {
		setSelectedIndex(initialIndex)
	}, [initialIndex])

	useLayoutEffect(() => {
		updateUnderline()
	}, [selectedIndex, children])

	useEffect(() => {
		if (!underlineStyle.width || revealed) return

		const id = window.setTimeout(() => setRevealed(true), 200)
		return () => clearTimeout(id)
	}, [underlineStyle.width, revealed])

	const updateUnderline = () => {
		const content = contentRef.current
		if (!content) return

		const slides = content.querySelectorAll<HTMLElement>('[data-tab-slide]')

		const selectedTab = slides[selectedIndex]
		if (!selectedTab) return

		setUnderlineStyle({
			width: `${selectedTab.offsetWidth}px`,
			transform: `translateX(${selectedTab.offsetLeft}px)`,
		})
	}

	useEffect(() => {
		updateUnderline()

		const resizeObserver = new ResizeObserver(() => {
			updateUnderline()
		})

		if (contentRef.current) {
			resizeObserver.observe(contentRef.current)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [selectedIndex, children])

	return (
		<div
			{...restProps}
			ref={tabsRef}
			className={twMerge(
				'relative w-full min-w-0 flex border-b border-separator',
				className,
			)}
		>
			<Carousel.Root options={carouselOptions} overflowing={overflowing}>
				<Carousel.Fade size={48}>
					<Carousel.Viewport ref={viewportRef}>
						<Carousel.Content
							ref={contentRef}
							className='relative min-w-full py-2.5 gap-1.5'
						>
							{React.Children.map(children, (child, index) => {
								if (!React.isValidElement<TabItemProps>(child)) return child

								return (
									<div
										key={child.key ?? index}
										data-tab-slide
										className='shrink-0'
									>
										{React.cloneElement(child, {
											selected: selectedIndex === index,
											onClick: () => handleSelect(index),
										})}
									</div>
								)
							})}

							<div
								aria-hidden
								className={twMerge(
									'absolute bottom-0 left-0 w-full h-0.75 flex items-end justify-center pointer-events-none transition-all duration-120 ease-in',
								)}
								style={underlineStyle}
							>
								<span
									className={twMerge(
										'mx-auto block w-8 bg-accent rounded-t',
										'transition-[height] duration-120 ease-in',
										revealed ? 'h-full delay-200' : 'h-0 delay-0',
									)}
								/>
							</div>
						</Carousel.Content>
					</Carousel.Viewport>
				</Carousel.Fade>
			</Carousel.Root>
		</div>
	)
}

export const Tabs = TabsRoot as TabsComponent

Tabs.Item = TabItem
Tabs.Item.displayName = 'Tabs.Item'

Tabs.displayName = 'Tabs'
