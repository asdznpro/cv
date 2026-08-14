'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { uploadCoverAction } from 'lib/articles'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

type UploadCoverDialogProps = {
	articleId?: string
	onCancel: () => void
	onSave: (payload: { file: File | null; url: string | null }) => void
}

export function UploadCoverDialog({
	articleId,
	onCancel,
	onSave,
}: UploadCoverDialogProps) {
	const [file, setFile] = useState<File | null>(null)
	const [pending, startTransition] = useTransition()

	function handleSave() {
		if (!file) {
			onSave({ file: null, url: null })
			return
		}

		startTransition(async () => {
			const formData = new FormData()
			formData.set('file', file)
			if (articleId) formData.set('articleId', articleId)

			const result = await uploadCoverAction(formData)
			if (!result.ok || !result.url) {
				toast.error(result.ok === false ? result.error : 'Upload failed')
				return
			}

			toast.success('Cover uploaded')
			onSave({ file, url: result.url })
		})
	}

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<p className='text-xl font-medium font-condensed tracking-tight'>
						Upload cover
					</p>
				</div>

				<FormItem id='article-cover-upload'>
					<FormItem.DropZone
						value={file}
						onValueChange={setFile}
						emptyTitle='Click to upload or drag and drop'
						emptyHint='PNG, JPG or GIF up to 10MB'
						className='h-auto!'
					/>
				</FormItem>
			</div>

			<Separator />

			<div className='flex @sm/overlay:grid grid-cols-2 items-center p-surface gap-surface'>
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
						onClick={handleSave}
						className='flex-1'
						type='button'
						size='sm'
						appearance='neutral'
						disabled={pending}
					>
						{pending ? 'Uploading…' : 'Save'}
					</Button>
				</div>
			</div>
		</div>
	)
}
