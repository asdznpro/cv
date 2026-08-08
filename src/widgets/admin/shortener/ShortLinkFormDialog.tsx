'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import {
	SHORT_LINK_HOST,
	updateShortLink,
	type ShortLink,
} from 'lib/short-links'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

import {
	Icon28ChainOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28InfoCircleOutline,
} from '@vkontakte/icons'

type FormState = {
	target_url: string
	slug: string
	title: string
}

type ShortLinkFormDialogProps = {
	link: ShortLink
	onCancel: () => void
	onSuccess: () => void
}

export function ShortLinkFormDialog({
	link,
	onCancel,
	onSuccess,
}: ShortLinkFormDialogProps) {
	const [pending, startTransition] = useTransition()
	const [form, setForm] = useState<FormState>(() => ({
		target_url: link.target_url,
		slug: link.slug,
		title: link.title ?? '',
	}))

	function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	function submit() {
		startTransition(async () => {
			const result = await updateShortLink(link.id, {
				target_url: form.target_url,
				slug: form.slug.trim() || link.slug,
				title: form.title.trim() || null,
			})

			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success('Ссылка обновлена')
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
						Edit short link
					</p>
				</div>
			</div>

			<Separator />

			<div className='flex flex-col p-surface gap-surface'>
				<div className='grid @md/overlay:grid-cols-2 gap-app'>
					<FormItem className='col-span-full' required>
						<FormItem.Label>Target URL</FormItem.Label>
						<FormItem.Input
							aria-label='Target URL'
							size='md'
							mode='outline'
							value={form.target_url}
							onChange={event =>
								setField('target_url', (event.target as HTMLInputElement).value)
							}
							placeholder='https://cv.asdzn.pro/...'
							disabled={pending}
							prefix={<Icon28ChainOutline width={18} height={18} />}
						/>
					</FormItem>

					<FormItem required>
						<FormItem.Label>Slug</FormItem.Label>
						<FormItem.Input
							aria-label='Slug'
							size='md'
							mode='outline'
							value={form.slug}
							onChange={event =>
								setField(
									'slug',
									(event.target as HTMLInputElement).value.toLowerCase(),
								)
							}
							placeholder='hh'
							disabled={pending}
							prefix={<Icon28HashtagOutline width={18} height={18} />}
						/>
					</FormItem>

					<FormItem optional>
						<FormItem.Label>Title</FormItem.Label>
						<FormItem.Input
							aria-label='Title'
							size='md'
							mode='outline'
							value={form.title}
							onChange={event =>
								setField('title', (event.target as HTMLInputElement).value)
							}
							placeholder='LinkedIn CV'
							disabled={pending}
							prefix={<Icon28InfoCircleOutline width={18} height={18} />}
						/>
					</FormItem>

					<FormItem className='col-span-full'>
						<FormItem.Label>Domain</FormItem.Label>
						<FormItem.Input
							aria-label='Domain'
							size='md'
							mode='outline'
							value={SHORT_LINK_HOST}
							readOnly
							prefix={<Icon28GlobeOutline width={18} height={18} />}
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
						Save
					</Button>
				</div>
			</div>
		</form>
	)
}
