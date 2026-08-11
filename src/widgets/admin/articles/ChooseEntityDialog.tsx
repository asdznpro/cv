'use client'

import { useState } from 'react'

import type { Company } from 'lib/companies'

import { Button, Separator } from 'ui/blocks'
import { FormItem } from 'ui/forms'

type ChooseEntityDialogProps = {
	companies: Company[]
	value: string | null
	onCancel: () => void
	onSave: (companyId: string | null) => void
}

export function ChooseEntityDialog({
	companies,
	value,
	onCancel,
	onSave,
}: ChooseEntityDialogProps) {
	const [companyId, setCompanyId] = useState(value ?? '')

	const options = companies.map(company => ({
		label: company.name,
		value: company.id,
	}))

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<p className='text-xl font-medium font-condensed tracking-tight'>
						Choose entity
					</p>
				</div>

				<FormItem id='article-entity-company'>
					<FormItem.Combobox
						size='md'
						mode='outline'
						options={options}
						value={companyId}
						onValueChange={setCompanyId}
						placeholder='Search company'
					/>
				</FormItem>
			</div>

			<Separator />

			<div className='flex @sm/overlay:grid grid-cols-2 items-center p-surface gap-surface'>
				<div className='col-start-2 flex flex-1 gap-2'>
					<Button
						className='flex-1'
						type='button'
						size='sm'
						appearance='neutral'
						mode='secondary'
						onClick={() => {
							onCancel()
							onSave(null)
						}}
					>
						Clear
					</Button>

					<Button
						className='flex-1'
						type='button'
						size='sm'
						appearance='neutral'
						onClick={() => onSave(companyId)}
						disabled={!companyId}
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	)
}
