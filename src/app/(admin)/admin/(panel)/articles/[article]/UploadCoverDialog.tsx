'use client'

import { useState } from 'react'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

interface UploadCoverDialogProps {
	onCancel: () => void
	onSave: (file: File | null) => void
}

export function UploadCoverDialog({
	onCancel,
	onSave,
}: UploadCoverDialogProps) {
	const [file, setFile] = useState<File | null>(null)

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
					>
						Cancel
					</Button>

					<Button
						onClick={() => onSave(file)}
						className='flex-1'
						type='button'
						size='sm'
						appearance='neutral'
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	)
}
