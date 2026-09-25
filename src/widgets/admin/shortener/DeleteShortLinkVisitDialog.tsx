'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import {
	deleteShortLinkVisitor,
	type ShortLink,
	type ShortLinkVisit,
} from 'lib/short-links'

import { Button } from 'ui/blocks'

type DeleteShortLinkVisitDialogProps = {
	link: ShortLink
	visit: ShortLinkVisit
	onCancel: () => void
	onSuccess: () => void
}

function visitLabel(visit: ShortLinkVisit) {
	const place = [visit.country, visit.city].filter(Boolean).join(' · ')
	return place || 'Unknown location'
}

export function DeleteShortLinkVisitDialog({
	link,
	visit,
	onCancel,
	onSuccess,
}: DeleteShortLinkVisitDialogProps) {
	const [pending, startTransition] = useTransition()
	const clicks = visit.hits === 1 ? '1 click' : `${visit.hits} clicks`

	function confirm() {
		startTransition(async () => {
			const result = await deleteShortLinkVisitor(link.id, visit.id)
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success('Visitor deleted')
			onSuccess()
		})
	}

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Delete this visitor?
					</h3>

					<p className='text-sm text-foreground-secondary'>
						<span className='italic'>{visitLabel(visit)}</span> and {clicks}{' '}
						will be removed from the link stats. The redirect stays live.
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
						Yes, delete
					</Button>
				</div>
			</div>
		</div>
	)
}
