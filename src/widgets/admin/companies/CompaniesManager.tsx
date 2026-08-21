'use client'

import { useRouter } from 'next/navigation'

import { type Company } from 'lib/companies'

import { Badge, Button, PreviewCard } from 'ui/blocks'
import { DropdownMenu, Tooltip } from 'ui/floating'
import { useOverlay } from 'ui/overlays'

import {
	Icon24DotsVertical,
	Icon28AddOutline,
	Icon28GlobeOutline,
	Icon28HashtagOutline,
	Icon28MoreHorizontal,
	Icon28EditOutline,
	Icon28DeleteOutline,
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
			{ className: 'max-w-sm' },
		)
	}

	return (
		<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
			<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
				<div className='flex flex-1 flex-col gap-3'>
					<h1 className='text-3xl font-medium font-condensed tracking-tight'>
						Companies Manager
					</h1>
				</div>

				<div className='flex self-start gap-2'>
					<Tooltip text='Add company'>
						<Button
							onClick={() => openCompanyForm(null)}
							mode='secondary'
							appearance='neutral'
							prefix={<Icon28AddOutline width={18} height={18} />}
							iconOnly
						/>
					</Tooltip>
				</div>
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
							<div className='flex 0items-center p-surface gap-surface'>
								{/* <Icon24DotsVertical
									className='cursor-grab text-foreground-tertiary my-auto'
									width={18}
									height={18}
								/> */}

								<PreviewCard
									className='size-14'
									ratio='square'
									src={company.logo}
									alt={company.name}
									radius='full'
									sizes='(max-width: 1240px) 100vw, 1240px'
									// inner={
									// 	<span className='z-1 absolute inset-0 w-full h-full'>
									// 		<span className='size-full flex items-center justify-center bg-surface/60'>
									// 			<Badge
									// 				appearance='neutral'
									// 				prefix={<Icon24DotsVertical width={16} height={16} />}
									// 			/>
									// 		</span>
									// 	</span>
									// }
								/>

								<div className='min-w-0 flex-1 flex flex-col gap-2'>
									<p className='text-xl font-medium font-condensed tracking-tight truncate'>
										{company.name}
									</p>

									{company.summary && (
										<p className='text-sm text-foreground-secondary line-clamp-2'>
											{company.summary}
										</p>
									)}

									<span className='flex flex-wrap gap-1'>
										<Badge
											size='sm'
											mode='soft'
											appearance='neutral'
											prefix={<Icon28HashtagOutline width={12} height={12} />}
										>
											{company.slug}
										</Badge>

										{company.url && (
											<Badge
												size='sm'
												mode='soft'
												appearance='neutral'
												prefix={<Icon28GlobeOutline width={12} height={12} />}
											>
												{company.url.split('/')[2]}
											</Badge>
										)}
									</span>
								</div>

								<div className='flex gap-2'>
									<DropdownMenu>
										<DropdownMenu.Trigger>
											<Button
												mode='ghost'
												appearance='neutral'
												prefix={<Icon28MoreHorizontal width={18} height={18} />}
												iconOnly
											/>
										</DropdownMenu.Trigger>

										<DropdownMenu.Content className='w-32'>
											<DropdownMenu.Box>
												<DropdownMenu.Item
													onClick={() => openCompanyForm(company)}
													aria-label='Edit company'
													prefix={<Icon28EditOutline width={18} height={18} />}
												>
													Edit
												</DropdownMenu.Item>

												<DropdownMenu.Item
													onClick={() => openDeleteCompany(company)}
													aria-label='Delete company'
													appearance='danger'
													prefix={
														<Icon28DeleteOutline width={18} height={18} />
													}
												>
													Delete
												</DropdownMenu.Item>
											</DropdownMenu.Box>
										</DropdownMenu.Content>
									</DropdownMenu>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	)
}
