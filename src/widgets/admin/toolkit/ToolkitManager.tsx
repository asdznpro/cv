'use client'

import { Fragment } from 'react'
import { useRouter } from 'next/navigation'

import { TOOLKIT_AREAS, type ToolkitArea, type ToolkitItem } from 'lib/toolkit'

import { Button } from 'ui/blocks'
import { Tooltip } from 'ui/floating'
import { useOverlay } from 'ui/overlays'

import { Icon28AddOutline } from '@vkontakte/icons'

import { DeleteToolkitDialog } from './DeleteToolkitDialog'
import { ToolkitCard } from './ToolkitCard'
import { ToolkitFormDialog } from './ToolkitFormDialog'

type ToolkitManagerProps = {
	items: ToolkitItem[]
}

export function ToolkitManager({ items }: ToolkitManagerProps) {
	const router = useRouter()
	const { open, close } = useOverlay()

	function openForm(item: ToolkitItem | null, area?: ToolkitArea) {
		open(
			<ToolkitFormDialog
				item={item}
				defaultArea={area}
				onCancel={() => close()}
				onSuccess={() => {
					close()
					router.refresh()
				}}
			/>,
			{ className: 'max-w-xl' },
		)
	}

	function openDelete(item: ToolkitItem) {
		open(
			<DeleteToolkitDialog
				item={item}
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
		<section className="mx-auto max-w-2xl w-full flex flex-col px-app gap-app">
			{TOOLKIT_AREAS.map((area) => {
				const areaItems = items.filter((item) => item.area === area.key)

				return (
					<Fragment key={area.key}>
						<div className="flex gap-app not-first-of-type:pt-8 pb-3">
							<div className="flex flex-1 flex-col gap-3">
								<h2 className="text-3xl font-medium font-condensed tracking-tight">
									{area.label}
								</h2>
							</div>

							<div className="flex self-start gap-2">
								<Tooltip text={`Add ${area.label} toolkit`}>
									<Button
										onClick={() => openForm(null, area.key)}
										mode="secondary"
										appearance="neutral"
										prefix={<Icon28AddOutline width={18} height={18} />}
										iconOnly
									/>
								</Tooltip>
							</div>
						</div>

						{areaItems.length > 0 && (
							<div className="grid grid-cols-1 @md:grid-cols-2 gap-app">
								{areaItems.map((item) => (
									<ToolkitCard
										key={item.id}
										item={item}
										onEdit={() => openForm(item)}
										onDelete={() => openDelete(item)}
									/>
								))}
							</div>
						)}
					</Fragment>
				)
			})}
		</section>
	)
}
