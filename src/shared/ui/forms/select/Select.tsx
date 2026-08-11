'use client'

import { useRef, useState } from 'react'

import {
	FloatingFocusManager,
	FloatingPortal,
	autoUpdate,
	flip,
	offset,
	shift,
	size,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useListNavigation,
	useRole,
	useTransitionStyles,
} from '@floating-ui/react'
import { twMerge } from 'tailwind-merge'
import { Icon28ChevronDownOutline } from '@vkontakte/icons'

import { FieldSurface } from '../_components/field-surface'
import { useFormItem } from '../form-item/FormItem.context'
import { inputVariants } from '../input/input.variants'
import { OptionList } from '../_components/option-list'
import type SelectProps from './Select.interface'

export function Select(props: SelectProps) {
	const formItem = useFormItem()
	const listRef = useRef<Array<HTMLElement | null>>([])
	const [open, setOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState<number | null>(null)

	const {
		options,
		value: valueProp,
		defaultValue,
		onValueChange,
		placeholder = 'Select…',
		disabled,
		required,
		id,
		name,
		className,
		mode,
		status: statusProp,
		size: fieldSize = 'lg',
		radius,
		prefix,
	} = props

	const isControlled = valueProp !== undefined
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
	const value = isControlled ? valueProp : uncontrolledValue

	const status = statusProp ?? formItem?.status ?? 'default'
	const isDisabled = disabled ?? formItem?.disabled ?? false
	const isRequired = required ?? formItem?.required ?? false
	const fieldId = id ?? formItem?.id
	const describedBy =
		formItem && status === 'error' ? formItem.captionId : undefined

	const selected = options.find(option => option.value === value)
	const label = selected?.label
	const selectedIndex = options.findIndex(option => option.value === value)

	const { refs, floatingStyles, context } = useFloating({
		open,
		onOpenChange: setOpen,
		placement: 'bottom-start',
		strategy: 'fixed',
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(6),
			flip({ padding: 8 }),
			shift({ padding: 8 }),
			size({
				padding: 8,
				apply({ rects, elements }) {
					Object.assign(elements.floating.style, {
						width: `${rects.reference.width}px`,
					})
				},
			}),
		],
	})

	const click = useClick(context, {
		event: 'mousedown',
		enabled: !isDisabled,
	})
	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'listbox' })
	const listNavigation = useListNavigation(context, {
		listRef,
		activeIndex,
		selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
		onNavigate: setActiveIndex,
		loop: true,
	})

	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
		[click, dismiss, role, listNavigation],
	)

	const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
		duration: { open: 120, close: 100 },
		initial: { opacity: 0, transform: 'scale(0.98)' },
	})

	function selectValue(next: string) {
		if (!isControlled) setUncontrolledValue(next)
		onValueChange?.(next)
		setOpen(false)
	}

	return (
		<>
			{name ? (
				<input type='hidden' name={name} value={value} disabled={isDisabled} />
			) : null}

			<span className={twMerge('relative inline-flex w-full', className)}>
				<button
					{...getReferenceProps()}
					ref={refs.setReference}
					type='button'
					id={fieldId}
					disabled={isDisabled}
					data-state={open ? 'open' : 'closed'}
					aria-invalid={status === 'error' || undefined}
					aria-required={isRequired || undefined}
					aria-describedby={describedBy}
					className={twMerge(
						'root w-full text-left outline-none',
						'disabled:cursor-not-allowed',
						inputVariants({ mode, status, size: fieldSize, radius }),
					)}
				>
					<FieldSurface
						mode={mode}
						status={status}
						radius={radius}
						disabled={isDisabled}
					/>

					<span className='in relative w-full h-full flex items-center justify-center py-1'>
						<span className='spacing w-0 h-full' />

						{prefix && (
							<span className='prefix flex gap-0.5 text-foreground-secondary'>
								{prefix}
							</span>
						)}
						<span
							className={twMerge(
								'content min-w-0 flex-1 truncate px-0.5',
								!label && 'text-foreground-secondary',
								isDisabled && 'text-foreground-secondary',
							)}
						>
							{label ?? placeholder}
						</span>

						<span className='suffix flex gap-0.5 text-foreground-secondary'>
							<Icon28ChevronDownOutline
								width={18}
								height={18}
								className='transition-transform duration-100 group-data-[state=open]:rotate-180'
							/>
						</span>

						<span className='spacing w-0 h-full' />
					</span>

					{isRequired && !formItem?.hasLabel && (
						<span className='absolute -top-3 -right-1.5 text-danger select-none'>
							*
						</span>
					)}
				</button>

				{isMounted && (
					<FloatingPortal>
						<FloatingFocusManager
							context={context}
							modal={false}
							initialFocus={-1}
						>
							<div
								{...getFloatingProps()}
								ref={refs.setFloating}
								style={floatingStyles}
								className='z-80 outline-none'
							>
								<OptionList
									options={options}
									value={value}
									activeIndex={activeIndex}
									listRef={listRef}
									getItemProps={getItemProps}
									onSelect={selectValue}
									mode={mode}
									radius={radius}
									style={transitionStyles}
								/>
							</div>
						</FloatingFocusManager>
					</FloatingPortal>
				)}
			</span>
		</>
	)
}
