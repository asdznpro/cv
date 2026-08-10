'use client'

import { useMemo, useRef, useState } from 'react'

import {
	FloatingFocusManager,
	FloatingPortal,
	autoUpdate,
	flip,
	offset,
	shift,
	size,
	useDismiss,
	useFloating,
	useInteractions,
	useListNavigation,
	useRole,
	useTransitionStyles,
} from '@floating-ui/react'
import { twMerge } from 'tailwind-merge'
import { Icon28CancelOutline, Icon28ChevronDownOutline } from '@vkontakte/icons'

import { FieldSurface } from '../_components/field-surface'
import { useFormItem } from '../form-item/FormItem.context'
import { inputVariants } from '../input/input.variants'
import { OptionList } from '../_components/option-list'
import type ComboboxProps from './Combobox.interface'

export function Combobox(props: ComboboxProps) {
	const formItem = useFormItem()
	const listRef = useRef<Array<HTMLElement | null>>([])
	const [open, setOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const [query, setQuery] = useState('')
	const [isFiltering, setIsFiltering] = useState(false)

	const {
		options,
		value: valueProp,
		defaultValue,
		onValueChange,
		placeholder = 'Search…',
		disabled,
		required,
		id,
		name,
		className,
		mode,
		status: statusProp,
		size: fieldSize = 'lg',
		radius,
		emptyText = 'No results',
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

	const filtered = useMemo(() => {
		if (!isFiltering) return options
		const needle = query.trim().toLowerCase()
		if (!needle) return options
		return options.filter(option => option.label.toLowerCase().includes(needle))
	}, [options, query, isFiltering])

	const selectedIndex = filtered.findIndex(option => option.value === value)

	const { refs, floatingStyles, context } = useFloating({
		open,
		onOpenChange: next => {
			setOpen(next)
			if (!next) {
				setActiveIndex(null)
				setIsFiltering(false)
			}
		},
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

	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'listbox' })
	const listNavigation = useListNavigation(context, {
		listRef,
		activeIndex,
		selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
		onNavigate: setActiveIndex,
		loop: true,
		virtual: true,
		enabled: open,
	})

	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
		[dismiss, role, listNavigation],
	)

	const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
		duration: { open: 120, close: 100 },
		initial: { opacity: 0, transform: 'scale(0.98)' },
	})

	function selectValue(next: string) {
		const option = options.find(item => item.value === next)
		if (!isControlled) setUncontrolledValue(next)
		onValueChange?.(next)
		setQuery(option?.label ?? '')
		setIsFiltering(false)
		setOpen(false)
		setActiveIndex(null)
	}

	function clearValue() {
		if (!isControlled) setUncontrolledValue('')
		onValueChange?.('')
		setQuery('')
		setIsFiltering(false)
		setOpen(false)
		setActiveIndex(null)
	}

	const inputValue = open ? query : (selected?.label ?? '')
	const hasValue = Boolean(value)

	return (
		<>
			{name ? (
				<input type='hidden' name={name} value={value} disabled={isDisabled} />
			) : null}

			<span className={twMerge('relative inline-flex w-full', className)}>
				<span
					ref={refs.setPositionReference}
					className={twMerge(
						'group root w-full',
						inputVariants({ mode, status, size: fieldSize, radius }),
						'input-disabled:cursor-not-allowed',
					)}
					data-state={open ? 'open' : 'closed'}
				>
					<FieldSurface
						mode={mode}
						status={status}
						radius={radius}
						disabled={isDisabled}
					/>

					<span className='in relative w-full h-full flex items-center justify-center py-1'>
						<span className='spacing w-0 h-full' />

						<input
							{...getReferenceProps({
								onFocus(event: React.FocusEvent<HTMLInputElement>) {
									if (isDisabled) return
									const input = event.currentTarget
									const index = options.findIndex(
										option => option.value === value,
									)
									setQuery(selected?.label ?? '')
									setIsFiltering(false)
									setActiveIndex(index >= 0 ? index : null)
									setOpen(true)
									requestAnimationFrame(() => input.select())
								},
								onChange(event: React.ChangeEvent<HTMLInputElement>) {
									setQuery(event.currentTarget.value)
									setIsFiltering(true)
									setOpen(true)
									setActiveIndex(0)
								},
								onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
									if (
										event.key === 'Enter' &&
										activeIndex != null &&
										filtered[activeIndex] &&
										!filtered[activeIndex].disabled
									) {
										event.preventDefault()
										selectValue(filtered[activeIndex].value)
									}
								},
							})}
							ref={refs.setReference}
							id={fieldId}
							type='text'
							role='combobox'
							aria-autocomplete='list'
							aria-expanded={open}
							aria-invalid={status === 'error' || undefined}
							aria-required={isRequired || undefined}
							aria-describedby={describedBy}
							disabled={isDisabled}
							required={isRequired}
							autoComplete='off'
							placeholder={placeholder}
							value={inputValue}
							className='content w-full h-full px-0.5 rounded-xs appearance-none outline-none placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary disabled:text-foreground-secondary disabled:cursor-not-allowed'
						/>

						<span className='suffix flex gap-0.5 text-foreground-secondary'>
							{hasValue ? (
								<button
									type='button'
									tabIndex={-1}
									aria-label='Clear'
									disabled={isDisabled}
									onMouseDown={event => event.preventDefault()}
									onClick={clearValue}
									className='appearance-none outline-none cursor-pointer disabled:pointer-events-none'
								>
									<Icon28CancelOutline width={18} height={18} />
								</button>
							) : (
								<Icon28ChevronDownOutline
									width={18}
									height={18}
									className='transition-transform duration-100 group-data-[state=open]:rotate-180'
								/>
							)}
						</span>

						<span className='spacing w-0 h-full' />
					</span>

					{isRequired && !formItem?.hasLabel && (
						<span className='absolute -top-3 -right-1.5 text-danger select-none'>
							*
						</span>
					)}
				</span>

				{isMounted && (
					<FloatingPortal>
						<FloatingFocusManager
							context={context}
							modal={false}
							initialFocus={-1}
							returnFocus={false}
						>
							<div
								{...getFloatingProps()}
								ref={refs.setFloating}
								style={floatingStyles}
								className='z-80 outline-none'
							>
								<OptionList
									options={filtered}
									value={value}
									activeIndex={activeIndex}
									listRef={listRef}
									getItemProps={getItemProps}
									onSelect={selectValue}
									mode={mode}
									radius={radius}
									emptyText={emptyText}
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
