'use client'

import { useEffect, useState } from 'react'

import { useDropZone, useFileDialog } from '@siberiacancode/reactuse'
import { twMerge } from 'tailwind-merge'

import { Button } from 'ui/blocks'
import {
	Icon28CancelOutline,
	Icon28PictureOutline,
	Icon28UploadOutline,
} from '@vkontakte/icons'

import { useFormItem } from '../form-item/FormItem.context'
import type DropZoneProps from './DropZone.interface'

const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/jpg,image/gif,image/webp'
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024

function formatSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function isAccepted(file: File, accept: string) {
	const tokens = accept
		.split(',')
		.map(token => token.trim().toLowerCase())
		.filter(Boolean)

	if (tokens.length === 0 || tokens.includes('*') || tokens.includes('*/*')) {
		return true
	}

	const type = file.type.toLowerCase()
	const name = file.name.toLowerCase()

	return tokens.some(token => {
		if (token.endsWith('/*')) {
			return type.startsWith(`${token.slice(0, -1)}`)
		}
		if (token.startsWith('.')) {
			return name.endsWith(token)
		}
		return type === token
	})
}

export function DropZone(props: DropZoneProps) {
	const formItem = useFormItem()

	const {
		value: valueProp,
		defaultValue = null,
		onValueChange,
		previewSrc,
		accept = DEFAULT_ACCEPT,
		dataTypes = ['image'],
		maxSize = DEFAULT_MAX_SIZE,
		multiple = false,
		disabled,
		required,
		id,
		name,
		className,
		status: statusProp,
		emptyTitle = 'Click to upload or drag and drop',
		emptyHint = 'PNG, JPG or GIF up to 10MB',
		onReject,
	} = props

	const isControlled = valueProp !== undefined
	const [uncontrolledValue, setUncontrolledValue] = useState<File | null>(
		defaultValue,
	)
	const value = isControlled ? valueProp : uncontrolledValue
	const [objectUrl, setObjectUrl] = useState<string | null>(null)

	const status = statusProp ?? formItem?.status ?? 'default'
	const isDisabled = disabled ?? formItem?.disabled ?? false
	const isRequired = required ?? formItem?.required ?? false
	const fieldId = id ?? formItem?.id
	const describedBy =
		formItem && status === 'error' ? formItem.captionId : undefined

	useEffect(() => {
		if (!value) {
			setObjectUrl(null)
			return
		}

		const url = URL.createObjectURL(value)
		setObjectUrl(url)
		return () => URL.revokeObjectURL(url)
	}, [value])

	function commit(file: File | null) {
		if (!isControlled) setUncontrolledValue(file)
		onValueChange?.(file)
	}

	function applyFiles(files: File[] | FileList | null | undefined) {
		if (isDisabled) return

		const list = files ? Array.from(files) : []
		const file = list[0]
		if (!file) return

		if (!isAccepted(file, accept)) {
			onReject?.('type', file)
			return
		}

		if (file.size > maxSize) {
			onReject?.('size', file)
			return
		}

		commit(file)
	}

	const fileDialog = useFileDialog(
		fileList => {
			applyFiles(fileList)
		},
		{
			accept,
			multiple,
			reset: true,
		},
	)

	const dropZone = useDropZone<HTMLDivElement>({
		dataTypes,
		multiple,
		onDrop(files) {
			applyFiles(files)
		},
	})

	const preview = objectUrl ?? previewSrc ?? null
	const hasFile = Boolean(value || previewSrc)

	function openPicker() {
		if (isDisabled) return
		fileDialog.open()
	}

	function clearValue(event: React.MouseEvent) {
		event.preventDefault()
		event.stopPropagation()
		if (isDisabled) return
		commit(null)
		fileDialog.reset()
	}

	return (
		<>
			{name && (
				<input
					type='hidden'
					name={name}
					value={value?.name ?? previewSrc ?? ''}
					disabled={isDisabled}
				/>
			)}

			<div
				ref={dropZone.ref}
				data-state={dropZone.overed ? 'over' : hasFile ? 'filled' : 'empty'}
				data-disabled={isDisabled || undefined}
				className={twMerge('group relative w-full 0h-48', className)}
			>
				<button
					type='button'
					id={fieldId}
					disabled={isDisabled}
					aria-invalid={status === 'error' || undefined}
					aria-describedby={describedBy}
					aria-label={hasFile ? 'Replace file' : 'Upload file'}
					onClick={openPicker}
					className={twMerge(
						'relative z-0 w-full h-full flex flex-col overflow-hidden',
						'rounded-lg border border-dashed border-separator bg-background/80 backdrop-blur-sm',
						'transition-all hover:bg-surface focus-visible:bg-surface',
						'disabled:pointer-events-none disabled:cursor-not-allowed',
						'appearance-none select-none cursor-pointer',
						'focus-ring-base focus-ring-visible',
						dropZone.overed && 'bg-surface-secondary focus-ring-active',
						status === 'error' && 'border-danger',
						hasFile && 'border-solid',
						isDisabled && 'opacity-60',
					)}
				>
					{hasFile && preview ? (
						<>
							<div className='relative min-h-0 flex flex-1 items-center justify-center overflow-hidden p-surface'>
								<img
									src={preview}
									alt=''
									aria-hidden
									className='absolute inset-0 size-full object-cover blur-2xl opacity-20'
								/>

								<div className='relative z-1 w-fit h-fit flex items-center justify-center overflow-hidden rounded'>
									<img
										src={preview}
										alt={value?.name ?? 'Uploaded file'}
										className='max-h-full max-w-full object-contain'
									/>
								</div>
							</div>

							<span className='relative z-1 w-full flex items-center p-2 gap-2 bg-surface border-t border-separator'>
								<span className='size-8 flex items-center justify-center rounded bg-surface-secondary text-foreground-secondary'>
									<Icon28PictureOutline width={18} height={18} />
								</span>

								<span className='min-w-0 flex-1 flex flex-col gap-1 text-left'>
									<span className='text-xs font-medium truncate'>
										{value?.name ?? 'Uploaded image'}
									</span>

									{value && (
										<span className='text-2xs text-foreground-secondary tabular-nums'>
											{formatSize(value.size)}
											{value.type
												? ` · ${value.type.replace('image/', '').toUpperCase()}`
												: null}
										</span>
									)}
								</span>
							</span>
						</>
					) : (
						<span className='flex flex-1 flex-col items-center justify-center p-surface gap-surface'>
							<span className='size-12 flex items-center justify-center rounded-full bg-surface-secondary text-foreground-secondary'>
								<Icon28UploadOutline width={20} height={20} />
							</span>

							<div className='flex flex-col gap-1'>
								<span className='text-lg font-medium font-condensed tracking-tight'>
									{dropZone.overed ? 'Drop image here' : emptyTitle}
								</span>

								{emptyHint && (
									<span className='text-xs text-foreground-secondary'>
										{emptyHint}
									</span>
								)}
							</div>
						</span>
					)}
				</button>

				{hasFile && (
					<Button
						className='z-1 absolute top-2 right-2'
						type='button'
						tabIndex={-1}
						aria-label='Clear'
						disabled={isDisabled}
						onMouseDown={event => event.preventDefault()}
						onClick={clearValue}
						size='sm'
						mode='soft'
						appearance='neutral'
						prefix={<Icon28CancelOutline width={18} height={18} />}
						iconOnly
					/>
				)}

				{isRequired && !formItem?.hasLabel && (
					<span className='absolute -top-3 -right-1.5 text-danger select-none'>
						*
					</span>
				)}
			</div>
		</>
	)
}
