'use client'

import {
	Children,
	cloneElement,
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type CSSProperties,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
	type Ref,
	type RefObject,
} from 'react'
import {
	FloatingFocusManager,
	FloatingList,
	FloatingNode,
	FloatingPortal,
	FloatingTree,
	autoUpdate,
	flip,
	offset,
	safePolygon,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useFloatingNodeId,
	useFloatingParentNodeId,
	useFloatingTree,
	useHover,
	useInteractions,
	useListItem,
	useListNavigation,
	useMergeRefs,
	useRole,
	useTransitionStyles,
	type Placement,
} from '@floating-ui/react'
import { twMerge } from 'tailwind-merge'

import { Button, Separator } from 'ui/blocks'
import { Icon28ChevronRightOutline } from '@vkontakte/icons'

import { resolveFloatingPlacement } from '../lib'
import type DropdownMenuProps from './DropdownMenu.interface'
import type {
	DropdownMenuBoxProps,
	DropdownMenuContentProps,
	DropdownMenuItemProps,
	DropdownMenuSubProps,
	DropdownMenuSubTriggerProps,
	DropdownMenuTriggerProps,
} from './DropdownMenu.interface'

/* ─── internal context ─── */

type ItemPropsUser = HTMLAttributes<HTMLElement> &
	ButtonHTMLAttributes<HTMLElement>

type DropdownMenuContextValue = {
	open: boolean
	setOpen: (open: boolean) => void
	refs: ReturnType<typeof useFloating>['refs']
	floatingStyles: CSSProperties
	getReferenceProps: (
		userProps?: HTMLAttributes<Element>,
	) => Record<string, unknown>
	getFloatingProps: (
		userProps?: HTMLAttributes<HTMLElement>,
	) => Record<string, unknown>
	getItemProps: (userProps?: ItemPropsUser) => Record<string, unknown>
	context: ReturnType<typeof useFloating>['context']
	isMounted: boolean
	transitionStyles: CSSProperties
	isNested: boolean
	activeIndex: number | null
	listRef: RefObject<Array<HTMLElement | null>>
	labelsRef: RefObject<Array<string | null>>
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

/** Active index of the list that owns the current Content (for nested SubTrigger). */
const ListActiveIndexContext = createContext<number | null>(null)

function useDropdownMenu() {
	const ctx = useContext(DropdownMenuContext)
	if (!ctx) {
		throw new Error('DropdownMenu.* must be used within <DropdownMenu>')
	}
	return ctx
}

/* ─── Menu node ─── */

function Menu({
	children,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	placement = 'bottom',
	align = 'end',
}: DropdownMenuProps) {
	const parentId = useFloatingParentNodeId()
	const isNested = parentId != null
	const nodeId = useFloatingNodeId()
	const tree = useFloatingTree()

	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
	const [activeIndex, setActiveIndex] = useState<number | null>(null)

	const listRef = useRef<Array<HTMLElement | null>>([])
	const labelsRef = useRef<Array<string | null>>([])

	const isControlled = openProp !== undefined
	const open = isControlled ? Boolean(openProp) : uncontrolledOpen

	const setOpen = useCallback(
		(next: boolean) => {
			if (!isControlled) setUncontrolledOpen(next)
			onOpenChange?.(next)
		},
		[isControlled, onOpenChange],
	)

	const resolvedPlacement = isNested
		? ('right-start' as Placement)
		: resolveFloatingPlacement(placement, align)

	const { refs, floatingStyles, context } = useFloating({
		nodeId,
		open,
		onOpenChange: setOpen,
		placement: resolvedPlacement,
		strategy: 'fixed',
		whileElementsMounted: autoUpdate,
		middleware: [
			offset({
				mainAxis: isNested ? 4 : 6,
				alignmentAxis: isNested ? -6 : 0,
			}),
			flip({ padding: 8, fallbackAxisSideDirection: 'end' }),
			shift({ padding: 8 }),
		],
	})

	const hover = useHover(context, {
		enabled: isNested,
		delay: { open: 80, close: 120 },
		handleClose: safePolygon({ buffer: 1 }),
	})
	const click = useClick(context, {
		event: 'mousedown',
		toggle: !isNested,
		ignoreMouse: isNested,
	})
	const dismiss = useDismiss(context, { bubbles: true })
	const role = useRole(context, { role: 'menu' })
	const listNavigation = useListNavigation(context, {
		listRef,
		activeIndex,
		nested: isNested,
		onNavigate: setActiveIndex,
	})

	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
		[hover, click, dismiss, role, listNavigation],
	)

	const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
		duration: { open: 120, close: 100 },
		initial: { opacity: 0, transform: 'scale(0.92)' },
	})

	useEffect(() => {
		if (!tree) return

		const onTreeClick = () => setOpen(false)
		const onSubMenuOpen = (event: { nodeId: string; parentId: string }) => {
			if (event.nodeId !== nodeId && event.parentId === parentId) {
				setOpen(false)
			}
		}

		tree.events.on('click', onTreeClick)
		tree.events.on('menuopen', onSubMenuOpen)
		return () => {
			tree.events.off('click', onTreeClick)
			tree.events.off('menuopen', onSubMenuOpen)
		}
	}, [tree, nodeId, parentId, setOpen])

	useEffect(() => {
		if (open && tree) {
			tree.events.emit('menuopen', { parentId, nodeId })
		}
	}, [tree, open, nodeId, parentId])

	const value = useMemo<DropdownMenuContextValue>(
		() => ({
			open,
			setOpen,
			refs,
			floatingStyles,
			getReferenceProps,
			getFloatingProps,
			getItemProps,
			context,
			isMounted,
			transitionStyles,
			isNested,
			activeIndex,
			listRef,
			labelsRef,
		}),
		[
			open,
			setOpen,
			refs,
			floatingStyles,
			getReferenceProps,
			getFloatingProps,
			getItemProps,
			context,
			isMounted,
			transitionStyles,
			isNested,
			activeIndex,
		],
	)

	return (
		<FloatingNode id={nodeId}>
			<DropdownMenuContext.Provider value={value}>
				{children}
			</DropdownMenuContext.Provider>
		</FloatingNode>
	)
}

/* ─── Root ─── */

function DropdownMenuRoot(props: DropdownMenuProps) {
	const parentId = useFloatingParentNodeId()

	if (parentId == null) {
		return (
			<FloatingTree>
				<Menu {...props} />
			</FloatingTree>
		)
	}

	return <Menu {...props} />
}

/* ─── Trigger ─── */

function Trigger({ children, className }: DropdownMenuTriggerProps) {
	const { refs, getReferenceProps, open } = useDropdownMenu()

	if (!isValidElement(children)) {
		throw new Error('DropdownMenu.Trigger expects a single React element child')
	}

	const child = children as ReactElement<{
		className?: string
		ref?: Ref<HTMLElement>
	}>

	const ref = useMergeRefs([refs.setReference, child.props.ref])

	return cloneElement(child, {
		...(getReferenceProps() as object),
		ref,
		className: twMerge(child.props.className, className),
		'data-state': open ? 'open' : 'closed',
	} as never)
}

/* ─── Content ─── */

function isBoxElement(
	child: ReactNode,
): child is ReactElement<{ children?: ReactNode }> {
	return isValidElement(child) && child.type === Box
}

function Content({ children, className }: DropdownMenuContentProps) {
	const {
		refs,
		floatingStyles,
		getFloatingProps,
		context,
		isMounted,
		transitionStyles,
		open,
		isNested,
		listRef,
		labelsRef,
		activeIndex: menuActiveIndex,
	} = useDropdownMenu()

	const boxes = Children.toArray(children).filter(isBoxElement)

	if (!isMounted) return null

	return (
		<FloatingPortal>
			<FloatingFocusManager
				context={context}
				modal={false}
				initialFocus={isNested ? -1 : 0}
				returnFocus={!isNested}
			>
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className='z-80 outline-none'
					{...getFloatingProps()}
				>
					<div
						style={transitionStyles}
						data-open={open || undefined}
						className={twMerge(
							'max-w-64 min-w-32 flex flex-col',
							'bg-background border border-separator rounded-xl',
							'shadow-xl shadow-background/40',
							'overflow-hidden',
							className,
						)}
					>
						<ListActiveIndexContext.Provider value={menuActiveIndex}>
							<FloatingList elementsRef={listRef} labelsRef={labelsRef}>
								{boxes.map((box, index) => (
									<div key={box.key ?? index}>
										{index > 0 && <Separator />}
										{box}
									</div>
								))}
							</FloatingList>
						</ListActiveIndexContext.Provider>
					</div>
				</div>
			</FloatingFocusManager>
		</FloatingPortal>
	)
}

/* ─── Box ─── */

function Box({ children, className }: DropdownMenuBoxProps) {
	return (
		<div className={twMerge('flex flex-col p-1.5 gap-1.5', className)}>
			{children}
		</div>
	)
}

/* ─── Item ─── */

function Item({
	children,
	className,
	prefix,
	suffix,
	appearance = 'neutral',
	disabled,
	onClick,
	closeOnSelect = true,
}: DropdownMenuItemProps) {
	const menu = useDropdownMenu()
	const item = useListItem({
		label: typeof children === 'string' ? children : undefined,
	})
	const tree = useFloatingTree()
	const listActiveIndex = useContext(ListActiveIndexContext)
	const isActive = item.index === (listActiveIndex ?? menu.activeIndex)

	return (
		<Button
			ref={item.ref}
			type='button'
			role='menuitem'
			tabIndex={isActive ? 0 : -1}
			className={twMerge('flex-1', className)}
			mode='ghost'
			appearance={appearance}
			prefix={prefix}
			suffix={suffix}
			align='between'
			disabled={disabled}
			{...menu.getItemProps({
				onClick(event: React.MouseEvent<HTMLElement>) {
					onClick?.(event)
					if (event.defaultPrevented || disabled) return
					if (closeOnSelect) {
						tree?.events.emit('click')
						menu.setOpen(false)
					}
				},
			})}
		>
			{children}
		</Button>
	)
}

/* ─── Sub ─── */

function Sub({ children }: DropdownMenuSubProps) {
	return <DropdownMenuRoot>{children}</DropdownMenuRoot>
}

function SubTrigger({
	children,
	className,
	prefix,
	appearance = 'neutral',
	disabled,
}: DropdownMenuSubTriggerProps) {
	const menu = useDropdownMenu()
	const item = useListItem({
		label: typeof children === 'string' ? children : undefined,
	})
	const listActiveIndex = useContext(ListActiveIndexContext)
	const isActive = item.index === listActiveIndex
	const ref = useMergeRefs([menu.refs.setReference, item.ref])

	return (
		<Button
			ref={ref}
			type='button'
			role='menuitem'
			tabIndex={isActive ? 0 : -1}
			className={twMerge('flex-1', className)}
			mode='ghost'
			appearance={appearance}
			prefix={prefix}
			suffix={<Icon28ChevronRightOutline width={18} height={18} />}
			align='between'
			disabled={disabled}
			data-state={menu.open ? 'open' : 'closed'}
			{...menu.getReferenceProps(
				menu.getItemProps({
					onClick(event: React.MouseEvent<HTMLElement>) {
						event.preventDefault()
					},
				}),
			)}
		>
			{children}
		</Button>
	)
}

function SubContent(props: DropdownMenuContentProps) {
	return <Content {...props} />
}

/* ─── compound ─── */

type DropdownMenuComponent = typeof DropdownMenuRoot & {
	Trigger: typeof Trigger
	Content: typeof Content
	Box: typeof Box
	Item: typeof Item
	Sub: typeof Sub
	SubTrigger: typeof SubTrigger
	SubContent: typeof SubContent
}

export const DropdownMenu = DropdownMenuRoot as DropdownMenuComponent

DropdownMenu.Trigger = Trigger
DropdownMenu.Content = Content
DropdownMenu.Box = Box
DropdownMenu.Item = Item
DropdownMenu.Sub = Sub
DropdownMenu.SubTrigger = SubTrigger
DropdownMenu.SubContent = SubContent

Trigger.displayName = 'DropdownMenu.Trigger'
Content.displayName = 'DropdownMenu.Content'
Box.displayName = 'DropdownMenu.Box'
Item.displayName = 'DropdownMenu.Item'
Sub.displayName = 'DropdownMenu.Sub'
SubTrigger.displayName = 'DropdownMenu.SubTrigger'
SubContent.displayName = 'DropdownMenu.SubContent'
