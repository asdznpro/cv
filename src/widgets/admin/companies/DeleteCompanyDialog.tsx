'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import { type Company, deleteCompany } from 'lib/companies'

import { Button } from 'ui/blocks'

type DeleteCompanyDialogProps = {
	company: Company
	onCancel: () => void
	onSuccess: () => void
}

export function DeleteCompanyDialog({
	company,
	onCancel,
	onSuccess,
}: DeleteCompanyDialogProps) {
	const [pending, startTransition] = useTransition()

	function confirm() {
		startTransition(async () => {
			const result = await deleteCompany(company.id)
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success('Компания удалена')
			onSuccess()
		})
	}

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Are you sure you want to delete this company?
					</h3>

					<p className='text-sm text-foreground-secondary'>
						«{company.name}» will be permanently deleted.
					</p>
				</div>

				<div className='flex justify-end gap-2'>
					<Button
						type='button'
						mode='secondary'
						appearance='neutral'
						onClick={onCancel}
						disabled={pending}
					>
						Cancel
					</Button>

					<Button
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
