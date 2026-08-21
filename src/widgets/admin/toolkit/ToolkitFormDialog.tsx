'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import {
	TOOLKIT_AREAS,
	TOOLKIT_PROFICIENCIES,
	TOOLKIT_TAGS,
	createToolkitItem,
	slugifyToolkitName,
	updateToolkitItem,
	uploadToolkitImageAction,
	type ToolkitArea,
	type ToolkitItem,
	type ToolkitProficiency,
	type ToolkitTag,
} from 'lib/toolkit'

import { Button, ScrollArea, Separator } from 'ui/blocks'
import { Checkbox, FormItem } from 'ui/forms'

import { Icon28HashtagOutline, Icon28InfoCircleOutline } from '@vkontakte/icons'

const IMAGE_ACCEPT =
	'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml'

const AREA_OPTIONS = TOOLKIT_AREAS.map(item => ({
	value: item.key,
	label: item.label,
}))

const PROFICIENCY_OPTIONS = TOOLKIT_PROFICIENCIES.map(item => ({
	value: item.key,
	label: item.label,
}))

const TAG_OPTIONS = TOOLKIT_TAGS.map(item => ({
	value: item.key,
	label: item.label,
}))

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/

type FormState = {
	name: string
	slug: string
	area: ToolkitArea
	tags: ToolkitTag[]
	proficiency: ToolkitProficiency
	color: string
	summary: string
	lockup_url: string
	lockup_width: string
	lockup_height: string
	show_label: boolean
	icon_url: string
}

function emptyForm(area: ToolkitArea): FormState {
	return {
		name: '',
		slug: '',
		area,
		tags: [],
		proficiency: 'occasional',
		color: '#2563eb',
		summary: '',
		lockup_url: '',
		lockup_width: '160',
		lockup_height: '160',
		show_label: true,
		icon_url: '',
	}
}

function toFormState(item: ToolkitItem): FormState {
	return {
		name: item.name,
		slug: item.slug,
		area: item.area,
		tags: item.tags,
		proficiency: item.proficiency,
		color: item.color,
		summary: item.summary,
		lockup_url: item.image.lockup.url,
		lockup_width: String(item.image.lockup.size.width),
		lockup_height: String(item.image.lockup.size.height),
		show_label: item.image.lockup.label,
		icon_url: item.image.icon.url,
	}
}

async function readImageSize(file: File) {
	const isSvg =
		file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')

	if (isSvg) {
		const text = await file.text()
		const viewBox = text.match(/viewBox=["']([\d.\s,-]+)["']/i)
		if (viewBox) {
			const parts = viewBox[1]
				.trim()
				.split(/[\s,]+/)
				.map(Number)
			const width = parts[2]
			const height = parts[3]
			if (width > 0 && height > 0) {
				return { width: Math.round(width), height: Math.round(height) }
			}
		}
	}

	const fromImage = await new Promise<{ width: number; height: number } | null>(
		resolve => {
			const url = URL.createObjectURL(file)
			const image = new window.Image()
			image.onload = () => {
				const width = image.naturalWidth
				const height = image.naturalHeight
				URL.revokeObjectURL(url)
				resolve(width > 0 && height > 0 ? { width, height } : null)
			}
			image.onerror = () => {
				URL.revokeObjectURL(url)
				resolve(null)
			}
			image.src = url
		},
	)

	return fromImage ?? { width: 160, height: 160 }
}

async function uploadKind(
	file: File,
	kind: 'lockup' | 'icon',
	itemId?: string,
) {
	const formData = new FormData()
	formData.set('file', file)
	formData.set('kind', kind)
	if (itemId) formData.set('itemId', itemId)
	return uploadToolkitImageAction(formData)
}

type ToolkitFormDialogProps = {
	item: ToolkitItem | null
	defaultArea?: ToolkitArea
	onCancel: () => void
	onSuccess: () => void
}

export function ToolkitFormDialog({
	item,
	defaultArea = 'design',
	onCancel,
	onSuccess,
}: ToolkitFormDialogProps) {
	const editingId = item?.id ?? null
	const [pending, startTransition] = useTransition()
	const [form, setForm] = useState<FormState>(() =>
		item ? toFormState(item) : emptyForm(defaultArea),
	)
	const [slugTouched, setSlugTouched] = useState(Boolean(item))
	const [lockupFile, setLockupFile] = useState<File | null>(null)
	const [iconFile, setIconFile] = useState<File | null>(null)

	function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	function onNameChange(value: string) {
		setForm(prev => ({
			...prev,
			name: value,
			slug: slugTouched ? prev.slug : slugifyToolkitName(value),
		}))
	}

	async function onLockupChange(next: File | null) {
		setLockupFile(next)
		if (!next) {
			setField('lockup_url', '')
			return
		}

		const size = await readImageSize(next)
		setForm(prev => ({
			...prev,
			lockup_width: String(size.width),
			lockup_height: String(size.height),
		}))
	}

	function submit() {
		startTransition(async () => {
			let lockup_url = form.lockup_url
			let icon_url = form.icon_url

			if (lockupFile) {
				const uploaded = await uploadKind(
					lockupFile,
					'lockup',
					editingId ?? undefined,
				)
				if (!uploaded.ok || !uploaded.url) {
					toast.error(
						uploaded.ok === false
							? uploaded.error
							: 'Не удалось загрузить lockup',
					)
					return
				}
				lockup_url = uploaded.url
			}

			if (iconFile) {
				const uploaded = await uploadKind(
					iconFile,
					'icon',
					editingId ?? undefined,
				)
				if (!uploaded.ok || !uploaded.url) {
					toast.error(
						uploaded.ok === false
							? uploaded.error
							: 'Не удалось загрузить иконку',
					)
					return
				}
				icon_url = uploaded.url
			}

			if (!lockup_url) {
				toast.error('Загрузите lockup')
				return
			}

			if (!icon_url) {
				toast.error('Загрузите иконку')
				return
			}

			const payload = {
				name: form.name,
				slug: form.slug,
				area: form.area,
				tags: form.tags,
				proficiency: form.proficiency,
				color: form.color,
				summary: form.summary,
				lockup_url,
				lockup_width: Number(form.lockup_width),
				lockup_height: Number(form.lockup_height),
				show_label: form.show_label,
				icon_url,
			}

			const result = editingId
				? await updateToolkitItem(editingId, payload)
				: await createToolkitItem(payload)

			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success(editingId ? 'Инструмент обновлён' : 'Инструмент создан')
			onSuccess()
		})
	}

	const canSubmit =
		!pending &&
		Boolean(lockupFile || form.lockup_url) &&
		Boolean(iconFile || form.icon_url)

	const colorValue = HEX_COLOR.test(form.color) ? form.color : '#2563eb'

	return (
		<form
			className='flex flex-col bg-surface border border-separator rounded-surface'
			onSubmit={event => {
				event.preventDefault()
				submit()
			}}
		>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<p className='text-xl font-medium font-condensed tracking-tight'>
						{editingId ? 'Edit toolkit item' : 'Create toolkit item'}
					</p>
				</div>
			</div>

			<Separator />

			<ScrollArea className='max-h-[min(60dvh,52rem)]'>
				<div className='flex flex-col p-surface gap-surface'>
					<div className='grid @md/overlay:grid-cols-2 gap-app'>
						<FormItem id='toolkit-icon-upload' required>
							<FormItem.Label>Icon</FormItem.Label>
							<FormItem.DropZone
								value={iconFile}
								onValueChange={next => {
									setIconFile(next)
									if (!next) setField('icon_url', '')
								}}
								previewSrc={form.icon_url || null}
								accept={IMAGE_ACCEPT}
								emptyTitle='Click to upload or drag and drop'
								emptyHint='PNG, JPG, GIF, WebP or SVG up to 10MB'
								disabled={pending}
								onReject={reason => {
									toast.error(
										reason === 'size'
											? 'Файл больше 10MB'
											: 'Допустимы PNG, JPG, GIF, WebP, SVG',
									)
								}}
							/>
						</FormItem>

						<FormItem id='toolkit-lockup-upload' required>
							<FormItem.Label>Lockup</FormItem.Label>
							<FormItem.DropZone
								value={lockupFile}
								onValueChange={next => {
									void onLockupChange(next)
								}}
								previewSrc={form.lockup_url || null}
								accept={IMAGE_ACCEPT}
								emptyTitle='Click to upload or drag and drop'
								emptyHint='PNG, JPG, GIF, WebP or SVG up to 10MB'
								disabled={pending}
								onReject={reason => {
									toast.error(
										reason === 'size'
											? 'Файл больше 10MB'
											: 'Допустимы PNG, JPG, GIF, WebP, SVG',
									)
								}}
							/>
						</FormItem>

						<FormItem className='col-span-full' required>
							<FormItem.Label>Name</FormItem.Label>
							<FormItem.Input
								aria-label='Name'
								size='md'
								mode='outline'
								value={form.name}
								onChange={event =>
									onNameChange((event.target as HTMLInputElement).value)
								}
								placeholder='Figma'
								disabled={pending}
								prefix={<Icon28InfoCircleOutline width={18} height={18} />}
							/>
						</FormItem>

						<FormItem required>
							<FormItem.Label>Slug</FormItem.Label>
							<FormItem.Input
								aria-label='Slug'
								size='md'
								mode='outline'
								value={form.slug}
								onChange={event => {
									setSlugTouched(true)
									setField(
										'slug',
										(event.target as HTMLInputElement).value.toLowerCase(),
									)
								}}
								placeholder='figma'
								disabled={pending}
								prefix={<Icon28HashtagOutline width={18} height={18} />}
							/>
						</FormItem>

						<FormItem required>
							<FormItem.Label>Color</FormItem.Label>
							<FormItem.Input
								aria-label='Color'
								size='md'
								mode='outline'
								value={form.color}
								onChange={event =>
									setField('color', (event.target as HTMLInputElement).value)
								}
								placeholder='#874fff'
								disabled={pending}
								prefix={
									<span className='relative size-4 shrink-0 overflow-hidden rounded-xs'>
										<input
											type='color'
											aria-label='Pick brand color'
											className='absolute inset-0 size-full cursor-pointer appearance-none border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-none [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-none [&::-moz-color-swatch]:border-0'
											value={colorValue}
											onChange={event => setField('color', event.target.value)}
											disabled={pending}
										/>
									</span>
								}
							/>
						</FormItem>

						<FormItem required>
							<FormItem.Label>Area</FormItem.Label>
							<FormItem.Select
								mode='outline'
								size='md'
								options={AREA_OPTIONS}
								value={form.area}
								onValueChange={value => setField('area', value as ToolkitArea)}
								placeholder='Select area'
								disabled={pending}
							/>
						</FormItem>

						<FormItem required>
							<FormItem.Label>Proficiency</FormItem.Label>
							<FormItem.Select
								mode='outline'
								size='md'
								options={PROFICIENCY_OPTIONS}
								value={form.proficiency}
								onValueChange={value =>
									setField('proficiency', value as ToolkitProficiency)
								}
								placeholder='Select proficiency'
								disabled={pending}
							/>
						</FormItem>

						<FormItem className='col-span-full' optional>
							<FormItem.Label>Tags</FormItem.Label>
							<FormItem.Autocomplete
								mode='outline'
								size='md'
								options={TAG_OPTIONS}
								value={form.tags}
								onValueChange={value => setField('tags', value as ToolkitTag[])}
								placeholder='Add tags'
								disabled={pending}
							/>
						</FormItem>

						<FormItem className='col-span-full' optional>
							<FormItem.Label>Summary</FormItem.Label>
							<FormItem.Textarea
								aria-label='Summary'
								size='md'
								mode='outline'
								value={form.summary}
								onChange={event =>
									setField(
										'summary',
										(event.target as HTMLTextAreaElement).value,
									)
								}
								placeholder='Why I use it'
								disabled={pending}
								resize='none'
							/>
						</FormItem>

						<FormItem required>
							<FormItem.Label>Lockup width</FormItem.Label>
							<FormItem.Input
								aria-label='Lockup width'
								size='md'
								mode='outline'
								type='number'
								min={1}
								value={form.lockup_width}
								onChange={event =>
									setField(
										'lockup_width',
										(event.target as HTMLInputElement).value,
									)
								}
								placeholder='160'
								disabled={pending}
							/>
						</FormItem>

						<FormItem required>
							<FormItem.Label>Lockup height</FormItem.Label>
							<FormItem.Input
								aria-label='Lockup height'
								size='md'
								mode='outline'
								type='number'
								min={1}
								value={form.lockup_height}
								onChange={event =>
									setField(
										'lockup_height',
										(event.target as HTMLInputElement).value,
									)
								}
								placeholder='160'
								disabled={pending}
							/>
						</FormItem>

						<div className='col-span-full flex gap-2 select-none'>
							<Checkbox
								id='toolkit-show-label'
								checked={form.show_label}
								onChange={event =>
									setField(
										'show_label',
										(event.target as HTMLInputElement).checked,
									)
								}
								disabled={pending}
							/>

							<label
								htmlFor='toolkit-show-label'
								className='text-sm font-medium'
							>
								Show name next to lockup
							</label>
						</div>
					</div>
				</div>
			</ScrollArea>

			<Separator />

			<div className='flex @md/overlay:grid grid-cols-2 items-center p-surface gap-surface'>
				<div className='col-start-2 flex flex-1 gap-2'>
					<Button
						onClick={onCancel}
						className='flex-1'
						type='button'
						size='sm'
						mode='secondary'
						appearance='neutral'
						disabled={pending}
					>
						Cancel
					</Button>

					<Button
						className='flex-1'
						type='submit'
						size='sm'
						appearance='neutral'
						disabled={!canSubmit}
					>
						{editingId ? 'Save' : 'Create'}
					</Button>
				</div>
			</div>
		</form>
	)
}
