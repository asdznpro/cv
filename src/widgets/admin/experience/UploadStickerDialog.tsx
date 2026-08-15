'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { uploadExperienceStickerAction, type ExperienceSticker } from 'lib/experience'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

type UploadStickerDialogProps = {
	experienceId?: string
	sticker: ExperienceSticker | null
	onCancel: () => void
	onSave: (sticker: ExperienceSticker | null) => void
}

export function UploadStickerDialog({
	experienceId,
	sticker,
	onCancel,
	onSave,
}: UploadStickerDialogProps) {
	const [file, setFile] = useState<File | null>(null)
	const [previewSrc, setPreviewSrc] = useState(sticker?.url ?? '')
	const [rotate, setRotate] = useState(String(sticker?.rotate ?? 0))
	const [pending, startTransition] = useTransition()

	function handleSave() {
		const nextRotate = Number(rotate)
		const rotateValue = Number.isFinite(nextRotate) ? nextRotate : 0

		if (!file && !previewSrc) {
			onSave(null)
			return
		}

		if (!file) {
			onSave({ url: previewSrc, rotate: rotateValue })
			return
		}

		startTransition(async () => {
			const formData = new FormData()
			formData.set('file', file)
			if (experienceId) formData.set('experienceId', experienceId)

			const result = await uploadExperienceStickerAction(formData)
			if (!result.ok || !result.url) {
				toast.error(result.ok === false ? result.error : 'Upload failed')
				return
			}

			toast.success('Sticker uploaded')
			onSave({ url: result.url, rotate: rotateValue })
		})
	}

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<p className='text-xl font-medium font-condensed tracking-tight'>
						Upload sticker
					</p>
				</div>

				<FormItem id='experience-sticker-upload'>
					<div
						className='[&_img]:origin-center [&_img]:transition-transform [&_img]:transform-[rotate(var(--sticker-rotate))]'
						style={{
							['--sticker-rotate' as string]: `${Number(rotate) || 0}deg`,
						}}
					>
						<FormItem.DropZone
							value={file}
							onValueChange={next => {
								setFile(next)
								if (!next) setPreviewSrc('')
							}}
							previewSrc={previewSrc || null}
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
					</div>
				</FormItem>

				<FormItem id='experience-sticker-rotate'>
					<FormItem.Label>Rotate (deg)</FormItem.Label>
					<FormItem.Input
						mode='outline'
						size='md'
						type='number'
						value={rotate}
						onChange={event =>
							setRotate((event.target as HTMLInputElement).value)
						}
						placeholder='0'
						disabled={pending}
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
