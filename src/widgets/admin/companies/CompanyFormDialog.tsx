'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import {
	type Company,
	createCompany,
	slugifyCompanyName,
	updateCompany,
} from 'lib/companies'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

import {
	Icon28InfoCircleOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28PictureOutline,
	Icon28StickerOutline,
	Icon28RotateLeftOutline,
} from '@vkontakte/icons'

type FormState = {
	name: string
	slug: string
	logo: string
	url: string
	sticker_image: string
	sticker_rotate: string
}

const EMPTY_FORM: FormState = {
	name: '',
	slug: '',
	logo: '',
	url: '',
	sticker_image: '',
	sticker_rotate: '',
}

function toFormState(company: Company): FormState {
	return {
		name: company.name,
		slug: company.slug,
		logo: company.logo,
		url: company.url ?? '',
		sticker_image: company.sticker_image ?? '',
		sticker_rotate:
			company.sticker_rotate === null ? '' : String(company.sticker_rotate),
	}
}

type CompanyFormDialogProps = {
	company: Company | null
	onCancel: () => void
	onSuccess: () => void
}

export function CompanyFormDialog({
	company,
	onCancel,
	onSuccess,
}: CompanyFormDialogProps) {
	const editingId = company?.id ?? null
	const [pending, startTransition] = useTransition()
	const [form, setForm] = useState<FormState>(() =>
		company ? toFormState(company) : EMPTY_FORM,
	)
	const [slugTouched, setSlugTouched] = useState(Boolean(company))

	function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	function onNameChange(value: string) {
		setForm(prev => ({
			...prev,
			name: value,
			slug: slugTouched ? prev.slug : slugifyCompanyName(value),
		}))
	}

	function submit() {
		const payload = {
			name: form.name,
			slug: form.slug,
			logo: form.logo,
			url: form.url || null,
			sticker_image: form.sticker_image || null,
			sticker_rotate: form.sticker_rotate.trim()
				? Number(form.sticker_rotate)
				: null,
		}

		startTransition(async () => {
			const result = editingId
				? await updateCompany(editingId, payload)
				: await createCompany(payload)

			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success(editingId ? 'Компания обновлена' : 'Компания создана')
			onSuccess()
		})
	}

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
						{editingId ? 'Edit company' : 'Create company'}
					</p>
				</div>
			</div>

			<Separator />

			<div className='flex flex-col p-surface gap-surface'>
				<div
					className={twMerge(
						'group min-h-32 flex items-center p-surface gap-surface',
						'rounded-md border border-dashed border-separator hover:bg-surface-secondary focus-visible:bg-surface-secondary active:scale-98',
						'transition-all duration-100 ease-in',
						'select-none cursor-pointer focus-ring-base focus-ring-visible',
					)}
				>
					<div className='flex flex-1 flex-col gap-2 text-center'>
						<p className='text-sm0 font-medium font-condensed tracking-tight'>
							Click to upload or drag and drop
						</p>

						<p className='text-xs text-foreground-secondary'>
							PNG, JPG or GIF up to 10MB
						</p>
					</div>
				</div>

				<div className='grid @md/overlay:grid-cols-2 gap-app'>
					<FormItem required>
						<FormItem.Label>Название</FormItem.Label>
						<FormItem.Input
							aria-label='Название'
							mode='secondary'
							value={form.name}
							onChange={event =>
								onNameChange((event.target as HTMLInputElement).value)
							}
							placeholder='Enter name'
							disabled={pending}
							prefix={<Icon28InfoCircleOutline width={20} height={20} />}
						/>
					</FormItem>

					<FormItem required>
						<FormItem.Label>Slug</FormItem.Label>
						<FormItem.Input
							aria-label='Slug'
							mode='secondary'
							value={form.slug}
							onChange={event => {
								setSlugTouched(true)
								setField('slug', (event.target as HTMLInputElement).value)
							}}
							placeholder='Enter slug'
							disabled={pending}
							prefix={<Icon28HashtagOutline width={20} height={20} />}
						/>
					</FormItem>

					<FormItem required>
						<FormItem.Label>Logo path</FormItem.Label>
						<FormItem.Input
							aria-label='Logo path'
							mode='secondary'
							value={form.logo}
							onChange={event =>
								setField('logo', (event.target as HTMLInputElement).value)
							}
							placeholder='Enter logo path'
							disabled={pending}
							prefix={<Icon28PictureOutline width={20} height={20} />}
						/>
					</FormItem>

					<FormItem optional>
						<FormItem.Label>Website</FormItem.Label>
						<FormItem.Input
							aria-label='Website'
							mode='secondary'
							value={form.url}
							onChange={event =>
								setField('url', (event.target as HTMLInputElement).value)
							}
							placeholder='Enter website'
							disabled={pending}
							prefix={<Icon28GlobeOutline width={20} height={20} />}
						/>
					</FormItem>

					<FormItem>
						<FormItem.Label>Sticker path</FormItem.Label>
						<FormItem.Input
							mode='secondary'
							aria-label='Sticker path'
							value={form.sticker_image}
							onChange={event =>
								setField(
									'sticker_image',
									(event.target as HTMLInputElement).value,
								)
							}
							placeholder='Enter sticker path'
							disabled={pending}
							prefix={<Icon28StickerOutline width={20} height={20} />}
						/>
					</FormItem>

					<FormItem>
						<FormItem.Label>Sticker rotate</FormItem.Label>
						<FormItem.Input
							mode='secondary'
							type='number'
							aria-label='Sticker rotate'
							value={form.sticker_rotate}
							onChange={event =>
								setField(
									'sticker_rotate',
									(event.target as HTMLInputElement).value,
								)
							}
							placeholder='Enter sticker rotate'
							disabled={pending}
							prefix={<Icon28RotateLeftOutline width={20} height={20} />}
						/>
					</FormItem>
				</div>
			</div>

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
						disabled={pending}
					>
						{editingId ? 'Save' : 'Create'}
					</Button>
				</div>
			</div>
		</form>
	)
}
