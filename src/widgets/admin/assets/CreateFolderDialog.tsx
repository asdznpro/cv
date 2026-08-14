'use client'

import { useState } from 'react'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

type CreateFolderDialogProps = {
	onCancel: () => void
	onSubmit: (name: string) => void
}

export function CreateFolderDialog({
	onCancel,
	onSubmit,
}: CreateFolderDialogProps) {
	const [name, setName] = useState('')

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Create folder
					</h3>

					<FormItem id='asset-folder-name' required>
						<FormItem.Input
							mode='outline'
							size='md'
							value={name}
							onChange={event =>
								setName((event.target as HTMLInputElement).value)
							}
							placeholder='Folder name'
							autoFocus
							onKeyDown={event => {
								if (event.key === 'Enter') {
									event.preventDefault()
									const trimmed = name.trim()
									if (trimmed) onSubmit(trimmed)
								}
							}}
						/>
					</FormItem>
				</div>
			</div>

			<Separator />

			<div className='flex @sm/overlay:grid grid-cols-2 items-center p-surface gap-surface'>
				<div className='col-start-2 flex flex-1 gap-2'>
					<Button
						className='flex-1'
						size='sm'
						type='button'
						mode='secondary'
						appearance='neutral'
						onClick={onCancel}
					>
						Cancel
					</Button>

					<Button
						className='flex-1'
						size='sm'
						type='button'
						appearance='neutral'
						disabled={!name.trim()}
						onClick={() => onSubmit(name.trim())}
					>
						Create
					</Button>
				</div>
			</div>
		</div>
	)
}
