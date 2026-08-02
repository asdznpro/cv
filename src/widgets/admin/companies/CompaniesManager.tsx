'use client'

import { useRouter } from 'next/navigation'

import { type Company } from 'lib/companies'

import { Badge, Button } from 'ui/blocks'
import { useOverlay } from 'ui/overlays'

import {
	Icon24DeleteOutline,
	Icon24DotsVertical,
	Icon24PenOutline,
	Icon28AddOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28MoreHorizontal,
} from '@vkontakte/icons'

import { CompanyFormDialog } from './CompanyFormDialog'
import { DeleteCompanyDialog } from './DeleteCompanyDialog'

type CompaniesManagerProps = {
	companies: Company[]
}

export function CompaniesManager({ companies }: CompaniesManagerProps) {
	const { open, close } = useOverlay()
	const router = useRouter()

	const openCompanyForm = (company: Company | null) => {
		open(
			<CompanyFormDialog
				company={company}
				onCancel={() => close()}
				onSuccess={() => {
					close()
					router.refresh()
				}}
			/>,
		)
	}

	const openDeleteCompany = (company: Company) => {
		open(
			<DeleteCompanyDialog
				company={company}
				onCancel={() => close()}
				onSuccess={() => {
					close()
					router.refresh()
				}}
			/>,
		)
	}

	return (
		<>
			<div className='flex flex-col gap-4'>
				<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
					Companies
				</h1>
			</div>

			{companies.length === 0 ? (
				<p className='text-foreground-secondary'>Пока нет компаний</p>
			) : (
				<ul className='flex flex-col gap-app'>
					{companies.map(company => (
						<li
							key={company.id}
							className='flex flex-col bg-surface border border-separator rounded-surface'
						>
							<div className='flex items-center p-surface gap-app'>
								<Icon24DotsVertical
									className='cursor-grab text-foreground-tertiary'
									width={18}
									height={18}
								/>

								<div className='min-w-0 flex-1 flex flex-col gap-2'>
									<p className='text-xl font-medium font-condensed tracking-tight truncate'>
										{company.name}
									</p>

									<span className='flex gap-1'>
										<Badge
											size='md'
											mode='soft'
											appearance='neutral'
											prefix={<Icon28HashtagOutline width={14} height={14} />}
										>
											{company.slug}
										</Badge>

										{company.url && (
											<Badge
												size='md'
												mode='soft'
												appearance='neutral'
												prefix={<Icon28GlobeOutline width={14} height={14} />}
											>
												{company.url.split('/')[2]}
											</Badge>
										)}
									</span>
								</div>

								<div className='flex gap-2'>
									<Button
										aria-label='Редактировать'
										mode='soft'
										appearance='neutral'
										prefix={<Icon24PenOutline width={18} height={18} />}
										onClick={() => openCompanyForm(company)}
										iconOnly
									/>

									<Button
										aria-label='Удалить'
										mode='soft'
										appearance='danger'
										prefix={<Icon24DeleteOutline width={18} height={18} />}
										onClick={() => openDeleteCompany(company)}
										iconOnly
									/>

									<Button
										mode='ghost'
										appearance='neutral'
										prefix={<Icon28MoreHorizontal width={20} height={20} />}
										iconOnly
									/>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}

			<Button
				className='w-full'
				size='lg'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon28AddOutline width={20} height={20} />}
				onClick={() => openCompanyForm(null)}
			>
				Add company
			</Button>
		</>
	)
}
