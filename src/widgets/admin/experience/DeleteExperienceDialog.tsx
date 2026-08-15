'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import {
	deleteExperience,
	formatExperiencePosition,
	type Experience,
} from 'lib/experience'

import { Button } from 'ui/blocks'

type DeleteExperienceDialogProps = {
	experience: Experience
	onCancel: () => void
	onSuccess: () => void
}

export function DeleteExperienceDialog({
	experience,
	onCancel,
	onSuccess,
}: DeleteExperienceDialogProps) {
	const [pending, startTransition] = useTransition()
	const label =
		experience.company?.name ??
		(experience.positions[0]
			? formatExperiencePosition(experience.positions[0])
			: 'this experience')

	function confirm() {
		startTransition(async () => {
			const result = await deleteExperience(experience.id)
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success('Experience deleted')
			onSuccess()
		})
	}

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Delete experience?
					</h3>

					<p className='text-sm text-foreground-secondary'>
						«{label}» will be permanently deleted.
					</p>
				</div>

				<div className='flex justify-end gap-2'>
					<Button
						size='sm'
						type='button'
						mode='secondary'
						appearance='neutral'
						onClick={onCancel}
						disabled={pending}
					>
						Cancel
					</Button>

					<Button
						size='sm'
						type='button'
						appearance='danger'
						onClick={confirm}
						disabled={pending}
					>
						Yes, delete it
					</Button>
				</div>
			</div>
		</div>
	)
}
