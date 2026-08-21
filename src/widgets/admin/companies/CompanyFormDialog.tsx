'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import {
	type Company,
	createCompany,
	slugifyCompanyName,
	updateCompany,
	uploadCompanyLogoAction,
} from 'lib/companies'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

import {
	Icon28InfoCircleOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
} from '@vkontakte/icons'

type FormState = {
	name: string
	slug: string
	logo: string
	url: string
	summary: string
}

const EMPTY_FORM: FormState = {
	name: '',
	slug: '',
	logo: '',
	url: '',
	summary: '',
}

function toFormState(company: Company): FormState {
	return {
		name: company.name,
		slug: company.slug,
		logo: company.logo,
		url: company.url ?? '',
		summary: company.summary ?? '',
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
	const [file, setFile] = useState<File | null>(null)

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
		startTransition(async () => {
			let logo = form.logo

			if (file) {
				const formData = new FormData()
				formData.set('file', file)
				if (editingId) formData.set('companyId', editingId)

				const uploaded = await uploadCompanyLogoAction(formData)
				if (!uploaded.ok || !uploaded.url) {
					toast.error(
						uploaded.ok === false
							? uploaded.error
							: 'Не удалось загрузить логотип',
					)
					return
				}

				logo = uploaded.url
			}

			if (!logo) {
				toast.error('Загрузите логотип')
				return
			}

			const payload = {
				name: form.name,
				slug: form.slug,
				logo,
				url: form.url || null,
				summary: form.summary,
			}

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
				<FormItem id='company-logo-upload' required>
					<FormItem.Label>Avatar</FormItem.Label>
					<FormItem.DropZone
						value={file}
						onValueChange={next => {
							setFile(next)
							if (!next) setField('logo', '')
						}}
						previewSrc={form.logo || null}
						accept='image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml'
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

				<div className='grid @md/overlay:grid-cols-2 gap-app'>
					<FormItem className='col-span-full' required>
						<FormItem.Label>Название</FormItem.Label>
						<FormItem.Input
							aria-label='Название'
							size='md'
							mode='outline'
							value={form.name}
							onChange={event =>
								onNameChange((event.target as HTMLInputElement).value)
							}
							placeholder='Enter name'
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
								setField('slug', (event.target as HTMLInputElement).value)
							}}
							placeholder='Enter slug'
							disabled={pending}
							prefix={<Icon28HashtagOutline width={18} height={18} />}
						/>
					</FormItem>

					<FormItem optional>
						<FormItem.Label>Website</FormItem.Label>
						<FormItem.Input
							aria-label='Website'
							size='md'
							mode='outline'
							value={form.url}
							onChange={event =>
								setField('url', (event.target as HTMLInputElement).value)
							}
							placeholder='Enter website'
							disabled={pending}
							prefix={<Icon28GlobeOutline width={18} height={18} />}
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
							placeholder='What this company is'
							disabled={pending}
							resize='none'
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
						disabled={pending || (!file && !form.logo)}
					>
						{editingId ? 'Save' : 'Create'}
					</Button>
				</div>
			</div>
		</form>
	)
}
