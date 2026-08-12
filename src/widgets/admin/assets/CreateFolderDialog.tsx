'use client'

import { useState } from 'react'

import { Button } from 'ui/blocks'
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
		<div className="flex flex-col bg-surface border border-separator rounded-surface">
			<div className="flex flex-col p-surface gap-surface">
				<div className="flex flex-1 flex-col gap-3">
					<h3 className="text-xl font-medium font-condensed tracking-tight">
						New folder
					</h3>

					<FormItem id="asset-folder-name">
						<FormItem.Label>Name</FormItem.Label>
						<FormItem.Input
							mode="outline"
							size="md"
							value={name}
							onChange={(event) =>
								setName((event.target as HTMLInputElement).value)
							}
							placeholder="covers"
							autoFocus
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									event.preventDefault()
									const trimmed = name.trim()
									if (trimmed) onSubmit(trimmed)
								}
							}}
						/>
					</FormItem>
				</div>

				<div className="flex justify-end gap-2">
					<Button
						size="sm"
						type="button"
						mode="secondary"
						appearance="neutral"
						onClick={onCancel}
					>
						Cancel
					</Button>

					<Button
						size="sm"
						type="button"
						appearance="accent"
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
