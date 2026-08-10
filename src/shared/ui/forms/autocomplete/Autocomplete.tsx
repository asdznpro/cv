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

import { Badge } from 'ui/blocks'
import { Icon28CancelOutline } from '@vkontakte/icons'

import { FieldSurface } from '../_components/field-surface'
import { OptionList } from '../_components/option-list'
import { useFormItem } from '../form-item/FormItem.context'
import { autocompleteVariants } from './autocomplete.variants'
import type AutocompleteProps from './Autocomplete.interface'

export function Autocomplete(props: AutocompleteProps) {
	const formItem = useFormItem()
	const listRef = useRef<Array<HTMLElement | null>>([])
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [open, setOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const [query, setQuery] = useState('')

	const {
		options,
		value: valueProp,
		defaultValue,
		onValueChange,
		placeholder = 'Add…',
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
	const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(
		defaultValue ?? [],
	)
	const value = isControlled ? valueProp : uncontrolledValue

	const status = statusProp ?? formItem?.status ?? 'default'
	const isDisabled = disabled ?? formItem?.disabled ?? false
	const isRequired = required ?? formItem?.required ?? false
	const fieldId = id ?? formItem?.id
	const describedBy =
		formItem && status === 'error' ? formItem.captionId : undefined

	const selectedOptions = useMemo(
		() =>
			value
				.map(item => options.find(option => option.value === item))
				.filter(Boolean) as Array<{ value: string; label: string }>,
		[options, value],
	)

	const filtered = useMemo(() => {
		const available = options.filter(option => !value.includes(option.value))
		const needle = query.trim().toLowerCase()
		if (!needle) return available
		return available.filter(option =>
			option.label.toLowerCase().includes(needle),
		)
	}, [options, query, value])

	const { refs, floatingStyles, context } = useFloating({
		open,
		onOpenChange: next => {
			setOpen(next)
			if (!next) setActiveIndex(null)
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
		selectedIndex: null,
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

	function commit(next: string[]) {
		if (!isControlled) setUncontrolledValue(next)
		onValueChange?.(next)
	}

	function addValue(next: string) {
		if (value.includes(next)) return
		commit([...value, next])
		setQuery('')
		setActiveIndex(0)
		setOpen(true)
		inputRef.current?.focus()
	}

	function removeValue(next: string) {
		commit(value.filter(item => item !== next))
		inputRef.current?.focus()
	}

	function setInputRef(node: HTMLInputElement | null) {
		inputRef.current = node
		refs.setReference(node)
	}

	return (
		<>
			{name &&
				value.map(item => (
					<input
						key={item}
						type='hidden'
						name={name}
						value={item}
						disabled={isDisabled}
					/>
				))}

			<span className={twMerge('relative inline-flex w-full', className)}>
				<span
					ref={refs.setPositionReference}
					className={twMerge(
						'group root w-full',
						autocompleteVariants({ mode, status, size: fieldSize, radius }),
					)}
					data-state={open ? 'open' : 'closed'}
				>
					<FieldSurface
						mode={mode}
						status={status}
						radius={radius}
						disabled={isDisabled}
					/>

					<span className='in relative w-full h-full flex items-center justify-center'>
						<span className='spacing w-0 self-stretch' />

						<span className='autocomplete w-full flex flex-wrap items-center gap-1'>
							{selectedOptions.map(option => (
								<Badge
									key={option.value}
									mode='secondary'
									appearance='neutral'
									size={fieldSize === 'md' ? 'sm' : 'md'}
									disabled={isDisabled}
									suffix={<Icon28CancelOutline width={14} height={14} />}
									onMouseDown={event => event.preventDefault()}
									onClick={() => {
										if (isDisabled) return
										removeValue(option.value)
									}}
								>
									{option.label}
								</Badge>
							))}

							<input
								{...getReferenceProps({
									onFocus() {
										if (isDisabled) return
										setOpen(true)
										setActiveIndex(filtered.length > 0 ? 0 : null)
									},
									onChange(event: React.ChangeEvent<HTMLInputElement>) {
										setQuery(event.currentTarget.value)
										setOpen(true)
										setActiveIndex(0)
									},
									onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
										if (
											event.key === 'Backspace' &&
											query === '' &&
											value.length > 0
										) {
											event.preventDefault()
											removeValue(value[value.length - 1])
											return
										}

										if (
											event.key === 'Enter' &&
											activeIndex != null &&
											filtered[activeIndex] &&
											!filtered[activeIndex].disabled
										) {
											event.preventDefault()
											addValue(filtered[activeIndex].value)
										}
									},
								})}
								ref={setInputRef}
								id={fieldId}
								type='text'
								role='combobox'
								aria-autocomplete='list'
								aria-expanded={open}
								aria-invalid={status === 'error' || undefined}
								aria-required={isRequired || undefined}
								aria-describedby={describedBy}
								disabled={isDisabled}
								required={isRequired && value.length === 0}
								autoComplete='off'
								placeholder={selectedOptions.length === 0 ? placeholder : ''}
								value={query}
								className={twMerge(
									'min-w-12 flex-1 rounded-xs',
									'appearance-none outline-none bg-transparent',
									'placeholder:text-foreground-secondary',
									'disabled:placeholder:text-foreground-tertiary disabled:text-foreground-secondary disabled:cursor-not-allowed',
								)}
							/>
						</span>

						<span className='spacing w-0 self-stretch' />
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
									onSelect={addValue}
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
