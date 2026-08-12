'use client'

import { Button } from 'ui/blocks'

type DeleteAssetDialogProps = {
	title: string
	description: string
	onCancel: () => void
	onConfirm: () => void
}

export function DeleteAssetDialog({
	title,
	description,
	onCancel,
	onConfirm,
}: DeleteAssetDialogProps) {
	return (
		<div className="flex flex-col bg-surface border border-separator rounded-surface">
			<div className="flex flex-col p-surface gap-surface">
				<div className="flex flex-1 flex-col gap-3">
					<h3 className="text-xl font-medium font-condensed tracking-tight">
						{title}
					</h3>

					<p className="text-sm text-foreground-secondary">{description}</p>
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
						appearance="danger"
						onClick={onConfirm}
					>
						Yes, delete
					</Button>
				</div>
			</div>
		</div>
	)
}
