'use client'

import { useRef, useEffect, useMemo, useId, CSSProperties } from 'react'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

interface StickerPeelProps {
	imageSrc: string
	rotate?: number
	peelBackHoverPct?: number
	peelBackActivePct?: number
	peelEasing?: string
	peelHoverEasing?: string
	width?: number
	shadowIntensity?: number
	lightingIntensity?: number
	initialPosition?: 'center' | 'random' | { x: number; y: number }
	peelDirection?: number
	/** Constrain drag: `true`/`'parent'` → parent, `'window'` → viewport, `false` → free */
	bounds?: boolean | 'parent' | 'window'
	className?: string
}

interface CSSVars extends CSSProperties {
	'--sticker-rotate'?: string
	'--sticker-p'?: string
	'--sticker-peelback-hover'?: string
	'--sticker-peelback-active'?: string
	'--sticker-peel-easing'?: string
	'--sticker-peel-hover-easing'?: string
	'--sticker-width'?: string
	'--sticker-shadow-opacity'?: number
	'--sticker-lighting-constant'?: number
	'--peel-direction'?: string
	'--sticker-start'?: string
	'--sticker-end'?: string
}

const StickerPeel: React.FC<StickerPeelProps> = ({
	imageSrc,
	rotate = 30,
	peelBackHoverPct = 30,
	peelBackActivePct = 40,
	peelEasing = 'power3.out',
	peelHoverEasing = 'power2.out',
	width = 200,
	shadowIntensity = 0.1,
	lightingIntensity = 0.1,
	initialPosition = 'center',
	peelDirection = 0,
	bounds = false,
	className = '',
}) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const dragTargetRef = useRef<HTMLDivElement>(null)
	const pointLightRef = useRef<SVGFEPointLightElement>(null)
	const pointLightFlippedRef = useRef<SVGFEPointLightElement>(null)
	const draggableInstanceRef = useRef<Draggable | null>(null)

	const defaultPadding = 12
	const boundsMode = bounds === true ? 'parent' : bounds

	// Несколько StickerPeel на странице → одинаковые #pointLight ломают свет
	// (url(#id) всегда резолвится в первый filter в DOM).
	const uid = useId().replace(/:/g, '')
	const filterIds = useMemo(
		() => ({
			pointLight: `sticker-pointLight-${uid}`,
			pointLightFlipped: `sticker-pointLightFlipped-${uid}`,
			dropShadow: `sticker-dropShadow-${uid}`,
			expandAndFill: `sticker-expandAndFill-${uid}`,
		}),
		[uid],
	)

	useEffect(() => {
		const target = dragTargetRef.current
		if (!target) return

		let startX = 0,
			startY = 0

		if (initialPosition === 'center') {
			return
		}

		if (
			typeof initialPosition === 'object' &&
			initialPosition.x !== undefined &&
			initialPosition.y !== undefined
		) {
			startX = initialPosition.x
			startY = initialPosition.y
		}

		gsap.set(target, { x: startX, y: startY })
	}, [initialPosition])

	useEffect(() => {
		const target = dragTargetRef.current
		if (!target) return

		const parentEl = target.parentNode as HTMLElement
		const dragBounds =
			boundsMode === 'parent'
				? parentEl
				: boundsMode === 'window'
					? window
					: undefined

		const draggable = Draggable.create(target, {
			type: 'x,y',
			...(dragBounds ? { bounds: dragBounds } : null),
			inertia: true,
			onDrag(this: Draggable) {
				const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.4)
				gsap.to(target, { rotation: rot, duration: 0.15, ease: 'power1.out' })
			},
			onDragEnd() {
				const rotationEase = 'power2.out'
				const duration = 0.8
				gsap.to(target, { rotation: 0, duration, ease: rotationEase })
			},
		})

		draggableInstanceRef.current = draggable[0]

		const handleResize = () => {
			if (!draggableInstanceRef.current) return

			draggableInstanceRef.current.update()

			if (boundsMode !== 'parent') return

			const currentX = gsap.getProperty(target, 'x') as number
			const currentY = gsap.getProperty(target, 'y') as number

			const boundsRect = parentEl.getBoundingClientRect()
			const targetRect = target.getBoundingClientRect()

			const maxX = boundsRect.width - targetRect.width
			const maxY = boundsRect.height - targetRect.height

			const newX = Math.max(0, Math.min(currentX, maxX))
			const newY = Math.max(0, Math.min(currentY, maxY))

			if (newX !== currentX || newY !== currentY) {
				gsap.to(target, {
					x: newX,
					y: newY,
					duration: 0.3,
					ease: 'power2.out',
				})
			}
		}

		window.addEventListener('resize', handleResize)
		window.addEventListener('orientationchange', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('orientationchange', handleResize)
			if (draggableInstanceRef.current) {
				draggableInstanceRef.current.kill()
			}
		}
	}, [boundsMode])

	useEffect(() => {
		const updateLight = (e: Event) => {
			const mouseEvent = e as MouseEvent
			const rect = containerRef.current?.getBoundingClientRect()
			if (!rect) return

			const x = mouseEvent.clientX - rect.left
			const y = mouseEvent.clientY - rect.top

			if (pointLightRef.current) {
				gsap.set(pointLightRef.current, { attr: { x, y } })
			}

			const normalizedAngle = Math.abs(peelDirection % 360)
			if (pointLightFlippedRef.current) {
				if (normalizedAngle !== 180) {
					gsap.set(pointLightFlippedRef.current, {
						attr: { x, y: rect.height - y },
					})
				} else {
					gsap.set(pointLightFlippedRef.current, {
						attr: { x: -1000, y: -1000 },
					})
				}
			}
		}

		const container = containerRef.current
		const eventType = 'mousemove'

		if (container) {
			container.addEventListener(eventType, updateLight)
			return () => container.removeEventListener(eventType, updateLight)
		}
	}, [peelDirection])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleTouchStart = () => {
			container.classList.add('touch-active')
		}

		const handleTouchEnd = () => {
			container.classList.remove('touch-active')
		}

		container.addEventListener('touchstart', handleTouchStart)
		container.addEventListener('touchend', handleTouchEnd)
		container.addEventListener('touchcancel', handleTouchEnd)

		return () => {
			container.removeEventListener('touchstart', handleTouchStart)
			container.removeEventListener('touchend', handleTouchEnd)
			container.removeEventListener('touchcancel', handleTouchEnd)
		}
	}, [])

	const cssVars: CSSVars = useMemo(
		() => ({
			'--sticker-rotate': `${rotate}deg`,
			'--sticker-p': `${defaultPadding}px`,
			'--sticker-peelback-hover': `${peelBackHoverPct}%`,
			'--sticker-peelback-active': `${peelBackActivePct}%`,
			'--sticker-peel-easing': peelEasing,
			'--sticker-peel-hover-easing': peelHoverEasing,
			'--sticker-width': `${width}px`,
			'--sticker-shadow-opacity': shadowIntensity,
			'--sticker-lighting-constant': lightingIntensity,
			'--peel-direction': `${peelDirection}deg`,
			'--sticker-start': `calc(-1 * ${defaultPadding}px)`,
			'--sticker-end': `calc(100% + ${defaultPadding}px)`,
		}),
		[
			rotate,
			peelBackHoverPct,
			peelBackActivePct,
			peelEasing,
			peelHoverEasing,
			width,
			shadowIntensity,
			lightingIntensity,
			peelDirection,
			defaultPadding,
		],
	)

	const stickerMainStyle: CSSProperties = {
		clipPath: `polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end))`,
		transition: 'clip-path 0.4s ease-out',
		filter: `url(#${filterIds.dropShadow})`,
		willChange: 'clip-path, transform',
	}

	const flapStyle: CSSProperties = {
		clipPath: `polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-start) var(--sticker-start))`,
		top: `calc(-100% - var(--sticker-p) - var(--sticker-p))`,
		transform: 'scaleY(-1)',
		transition: 'all 0.4s ease-out',
		willChange: 'clip-path, transform',
	}

	const shadowFlapStyle: CSSProperties = {
		// Без scaleY(-1) нельзя использовать top: -100% — это позиция для
		// перевёрнутого flap над стикером. Тень живёт на лице, под линией peel.
		clipPath: `polygon(var(--sticker-start) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-start) var(--sticker-peelback-hover))`,
		top: 0,
		opacity: 0,
		transition: 'clip-path 0.4s ease-out, opacity 0.4s ease-out',
		willChange: 'clip-path, opacity',
	}

	const imageStyle: CSSProperties = {
		transform: `rotate(calc(${rotate}deg - ${peelDirection}deg))`,
		width: `${width}px`,
	}

	const shadowImageStyle: CSSProperties = {
		...imageStyle,
		filter: `url(#${filterIds.expandAndFill})`,
	}

	return (
		<div
			className={`absolute cursor-grab active:cursor-grabbing transform-gpu ${className}`}
			ref={dragTargetRef}
			style={cssVars}
		>
			<style
				dangerouslySetInnerHTML={{
					__html: `
          .sticker-container:hover .sticker-main,
          .sticker-container.touch-active .sticker-main {
            clip-path: polygon(var(--sticker-start) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
          }
          .sticker-container:hover .sticker-flap,
          .sticker-container.touch-active .sticker-flap {
            clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-start) var(--sticker-peelback-hover)) !important;
            top: calc(-100% + 2 * var(--sticker-peelback-hover) - 1px) !important;
          }
          .sticker-container:hover .sticker-shadow-flap,
          .sticker-container.touch-active .sticker-shadow-flap {
            opacity: 1 !important;
            clip-path: polygon(var(--sticker-start) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-end) calc(var(--sticker-peelback-hover) + 24%), var(--sticker-start) calc(var(--sticker-peelback-hover) + 24%)) !important;
          }
          .sticker-container:active .sticker-main {
            clip-path: polygon(var(--sticker-start) var(--sticker-peelback-active), var(--sticker-end) var(--sticker-peelback-active), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
          }
          .sticker-container:active .sticker-flap {
            clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-peelback-active), var(--sticker-start) var(--sticker-peelback-active)) !important;
            top: calc(-100% + 2 * var(--sticker-peelback-active) - 1px) !important;
          }
          .sticker-container:active .sticker-shadow-flap {
            opacity: 1 !important;
            clip-path: polygon(var(--sticker-start) var(--sticker-peelback-active), var(--sticker-end) var(--sticker-peelback-active), var(--sticker-end) calc(var(--sticker-peelback-active) + 40%), var(--sticker-start) calc(var(--sticker-peelback-active) + 40%)) !important;
          }
        `,
				}}
			/>

			<svg width='0' height='0' aria-hidden>
				<defs>
					<filter id={filterIds.pointLight}>
						<feGaussianBlur stdDeviation='1' result='blur' />
						<feSpecularLighting
							result='spec'
							in='blur'
							specularExponent='100'
							specularConstant={lightingIntensity}
							lightingColor='white'
						>
							<fePointLight ref={pointLightRef} x='100' y='100' z='300' />
						</feSpecularLighting>
						<feComposite in='spec' in2='SourceGraphic' result='lit' />
						<feComposite in='lit' in2='SourceAlpha' operator='in' />
					</filter>

					<filter id={filterIds.pointLightFlipped}>
						<feGaussianBlur stdDeviation='10' result='blur' />
						<feSpecularLighting
							result='spec'
							in='blur'
							specularExponent='100'
							specularConstant={lightingIntensity * 7}
							lightingColor='white'
						>
							<fePointLight
								ref={pointLightFlippedRef}
								x='100'
								y='100'
								z='300'
							/>
						</feSpecularLighting>
						<feComposite in='spec' in2='SourceGraphic' result='lit' />
						<feComposite in='lit' in2='SourceAlpha' operator='in' />
					</filter>

					<filter id={filterIds.dropShadow}>
						<feDropShadow
							dx='2'
							dy='4'
							stdDeviation={3 * shadowIntensity}
							floodColor='black'
							floodOpacity={shadowIntensity}
						/>
					</filter>

					<filter id={filterIds.expandAndFill}>
						<feOffset dx='0' dy='0' in='SourceAlpha' result='shape' />
						<feFlood floodColor='rgb(179,179,179)' result='flood' />
						<feComposite operator='in' in='flood' in2='shape' />
					</filter>
				</defs>
			</svg>

			<div
				className='sticker-container relative select-none touch-none sm:touch-auto'
				ref={containerRef}
				style={{
					WebkitUserSelect: 'none',
					userSelect: 'none',
					WebkitTouchCallout: 'none',
					WebkitTapHighlightColor: 'transparent',
					transform: `rotate(${peelDirection}deg)`,
					transformOrigin: 'center',
				}}
			>
				<div className='sticker-main' style={stickerMainStyle}>
					<div style={{ filter: `url(#${filterIds.pointLight})` }}>
						<img
							src={imageSrc}
							alt=''
							className='block'
							style={imageStyle}
							draggable='false'
							onContextMenu={e => e.preventDefault()}
						/>
					</div>
				</div>

				<div
					className='pointer-events-none absolute inset-0 opacity-40'
					style={{ filter: 'brightness(0) blur(6px)' }}
				>
					<div
						className='sticker-shadow-flap absolute left-0 h-full w-full'
						style={shadowFlapStyle}
					>
						<img
							src={imageSrc}
							alt=''
							className='block'
							style={shadowImageStyle}
							draggable='false'
							onContextMenu={e => e.preventDefault()}
						/>
					</div>
				</div>

				<div
					className='sticker-flap absolute w-full h-full left-0'
					style={flapStyle}
				>
					<div style={{ filter: `url(#${filterIds.pointLightFlipped})` }}>
						<img
							src={imageSrc}
							alt=''
							className='block'
							style={shadowImageStyle}
							draggable='false'
							onContextMenu={e => e.preventDefault()}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export { StickerPeel }
