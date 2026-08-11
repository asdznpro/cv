'use client'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

interface ChooseEntityDialogProps {
	onCancel: () => void
	onSave: (file: File | null) => void
}

export function ChooseEntityDialog({ onCancel }: ChooseEntityDialogProps) {
	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<p className='text-xl font-medium font-condensed tracking-tight'>
						Choose entity or create new
					</p>
				</div>

				<FormItem id='article-cover-upload'>
					<FormItem.Combobox size='md' mode='outline' options={[]} />
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
