'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { SHORT_LINK_HOST, createShortLink } from 'lib/short-links'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

import {
	Icon28ChainOutline,
	Icon28ChevronDownOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28InfoCircleOutline,
} from '@vkontakte/icons'

type CreateFormState = {
	target_url: string
	slug: string
	title: string
}

const EMPTY_CREATE_FORM: CreateFormState = {
	target_url: '',
	slug: '',
	title: '',
}

export function CreateShortLinkForm() {
	const router = useRouter()
	const [pending, startTransition] = useTransition()
	const [form, setForm] = useState<CreateFormState>(EMPTY_CREATE_FORM)

	function setField<K extends keyof CreateFormState>(
		key: K,
		value: CreateFormState[K],
	) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	function resetForm() {
		setForm(EMPTY_CREATE_FORM)
	}

	function submitCreate(event: React.FormEvent) {
		event.preventDefault()

		startTransition(async () => {
			const result = await createShortLink({
				target_url: form.target_url,
				slug: form.slug.trim() || null,
				title: form.title.trim() || null,
			})

			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success('Ссылка создана')
			resetForm()
			router.refresh()
		})
	}

	return (
		<form
			className='flex flex-col bg-surface border border-separator rounded-surface'
			onSubmit={submitCreate}
		>
			<div className='flex p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Target URL
					</h3>

					<p className='text-sm text-foreground-secondary'>
						Full destination where visitors will be redirected after opening the
						short link
					</p>
				</div>

				<div className='w-2/5'>
					<FormItem id='short-target-url' required>
						<FormItem.Input
							size='md'
							mode='outline'
							type='url'
							value={form.target_url}
							onChange={event =>
								setField('target_url', (event.target as HTMLInputElement).value)
							}
							placeholder='https://cv.asdzn.pro/...'
							disabled={pending}
							prefix={<Icon28ChainOutline width={18} height={18} />}
						/>
					</FormItem>
				</div>
			</div>

			<Separator />

			<div className='flex p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Slug <span className='text-foreground-secondary'>(optional)</span>
					</h3>

					<p className='text-sm text-foreground-secondary'>
						Custom path segment for the short link. Leave empty to generate a
						random slug automatically.
					</p>
				</div>

				<div className='w-2/5'>
					<FormItem id='short-slug' optional>
						<FormItem.Input
							size='md'
							mode='outline'
							type='text'
							value={form.slug}
							onChange={event =>
								setField(
									'slug',
									(event.target as HTMLInputElement).value.toLowerCase(),
								)
							}
							placeholder='example'
							disabled={pending}
							prefix={<Icon28HashtagOutline width={18} height={18} />}
						/>
					</FormItem>
				</div>
			</div>

			<Separator />

			<div className='flex p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Title <span className='text-foreground-secondary'>(optional)</span>
					</h3>

					<p className='text-sm text-foreground-secondary'>
						Internal label to identify the link in your admin list
					</p>
				</div>

				<div className='w-2/5'>
					<FormItem id='short-title' optional>
						<FormItem.Input
							size='md'
							mode='outline'
							type='text'
							value={form.title}
							onChange={event =>
								setField('title', (event.target as HTMLInputElement).value)
							}
							placeholder='Example, LinkedIn CV'
							disabled={pending}
							prefix={<Icon28InfoCircleOutline width={18} height={18} />}
						/>
					</FormItem>
				</div>
			</div>

			<Separator />

			<div className='flex p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Choose domain
					</h3>

					<p className='text-sm text-foreground-secondary'>
						Host used for all short links — currently fixed to a single domain
					</p>
				</div>

				<div className='w-2/5'>
					<FormItem id='short-domain'>
						<FormItem.Input
							size='md'
							mode='outline'
							type='text'
							value={SHORT_LINK_HOST}
							prefix={<Icon28GlobeOutline width={18} height={18} />}
							suffix={<Icon28ChevronDownOutline width={18} height={18} />}
							readOnly
						/>
					</FormItem>
				</div>
			</div>

			<Separator />

			<div className='flex items-center p-surface gap-surface'>
				<div className='ml-auto w-2/5 flex gap-2'>
					<Button
						className='flex-1'
						type='button'
						size='sm'
						mode='secondary'
						appearance='neutral'
						onClick={resetForm}
						disabled={pending}
					>
						Reset
					</Button>

					<Button className='flex-1' type='submit' size='sm' disabled={pending}>
						Shorten
					</Button>
				</div>
			</div>
		</form>
	)
}
