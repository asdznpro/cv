'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import {
	type Company,
	createCompany,
	deleteCompany,
	slugifyCompanyName,
	updateCompany,
} from 'lib/companies'

import { Badge, Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'
import {
	Icon24DeleteOutline,
	Icon24DotsVertical,
	Icon24PenOutline,
	Icon28AddOutline,
	Icon28InfoCircleOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28MoreHorizontal,
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

type CompaniesManagerProps = {
	companies: Company[]
}

export function CompaniesManager({ companies }: CompaniesManagerProps) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()
	const [editingId, setEditingId] = useState<string | null>(null)
	const [isCreating, setIsCreating] = useState(false)
	const [form, setForm] = useState<FormState>(EMPTY_FORM)
	const [slugTouched, setSlugTouched] = useState(false)

	const showForm = isCreating || editingId !== null

	function openCreate() {
		setEditingId(null)
		setIsCreating(true)
		setSlugTouched(false)
		setForm(EMPTY_FORM)
	}

	function openEdit(company: Company) {
		setIsCreating(false)
		setEditingId(company.id)
		setSlugTouched(true)
		setForm(toFormState(company))
	}

	function closeForm() {
		setIsCreating(false)
		setEditingId(null)
		setSlugTouched(false)
		setForm(EMPTY_FORM)
	}

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
			closeForm()
			router.refresh()
		})
	}

	function remove(company: Company) {
		if (!window.confirm(`Удалить «${company.name}»?`)) return

		startTransition(async () => {
			const result = await deleteCompany(company.id)
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success('Компания удалена')
			if (editingId === company.id) closeForm()
			router.refresh()
		})
	}

	return (
		<>
			<div className='flex flex-col gap-4'>
				<h1 className='text-5xl font-medium font-condensed tracking-tight'>
					Companies
				</h1>
			</div>

			{showForm && (
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

						<div className='grid @2xl:grid-cols-2 gap-app'>
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

					<div className='flex flex-col p-surface gap-surface'>
						<div className='flex justify-end gap-2'>
							<Button
								onClick={closeForm}
								type='button'
								mode='secondary'
								appearance='neutral'
								disabled={pending}
							>
								Cancel
							</Button>

							<Button type='submit' appearance='neutral' disabled={pending}>
								{editingId ? 'Save' : 'Create'}
							</Button>
						</div>
					</div>
				</form>
			)}

			{companies.length === 0 ? (
				<p className='text-foreground-secondary'>Пока нет компаний</p>
			) : (
				<ul className='flex flex-col gap-app'>
					{companies.map(company => (
						<li
							key={company.id}
							className='flex flex-col bg-surface border border-separator rounded-surface'
						>
							<div className='flex items-center p-surface gap-app'>
								<Icon24DotsVertical
									className='cursor-grab text-foreground-tertiary'
									width={18}
									height={18}
								/>

								{/* <div className='w-14 h-14 shrink-0 overflow-hidden rounded-full 0border border-separator bg-surface'>
									{company.logo ? (
										<Image
											src={company.logo}
											alt={company.name}
											width={96}
											height={96}
											className='h-full w-full object-cover'
										/>
									) : null}
								</div> */}

								<div className='min-w-0 flex-1 flex flex-col gap-2'>
									<p className='text-xl font-medium font-condensed tracking-tight truncate'>
										{company.name}
									</p>

									{/* <p className='text-sm text-foreground-secondary truncate'>
										{company.slug}
										{company.url ? ` · ${company.url.split('/')[2]}` : ''}
									</p> */}

									<span className='flex gap-1'>
										<Badge
											size='md'
											mode='soft'
											appearance='neutral'
											prefix={<Icon28HashtagOutline width={14} height={14} />}
										>
											{company.slug}
										</Badge>

										{company.url && (
											<Badge
												size='md'
												mode='soft'
												appearance='neutral'
												prefix={<Icon28GlobeOutline width={14} height={14} />}
											>
												{company.url.split('/')[2]}
											</Badge>
										)}
									</span>
								</div>

								<div className='flex gap-2'>
									<Button
										aria-label='Редактировать'
										mode='soft'
										appearance='neutral'
										prefix={<Icon24PenOutline width={18} height={18} />}
										onClick={() => openEdit(company)}
										disabled={pending}
										iconOnly
									/>

									<Button
										aria-label='Удалить'
										mode='soft'
										appearance='danger'
										prefix={<Icon24DeleteOutline width={18} height={18} />}
										onClick={() => remove(company)}
										disabled={pending}
										iconOnly
									/>

									<Button
										mode='ghost'
										appearance='neutral'
										prefix={<Icon28MoreHorizontal width={18} height={18} />}
										iconOnly
									/>
								</div>
							</div>
						</li>
					))}

					<Button
						className='w-full'
						size='lg'
						mode='ghost'
						appearance='neutral'
						prefix={<Icon28AddOutline width={20} height={20} />}
						onClick={openCreate}
						disabled={pending}
					>
						Add company
					</Button>
				</ul>
			)}
		</>
	)
}
