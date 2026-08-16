import { Fragment } from 'react'

import { TOOLKIT_AREAS, type ToolkitItem } from 'lib/toolkit'

import { ToolkitCard } from './ToolkitCard'

type ToolkitListProps = {
	items: ToolkitItem[]
}

export function ToolkitList({ items }: ToolkitListProps) {
	const grouped = TOOLKIT_AREAS.map(area => ({
		area,
		items: items.filter(item => item.area === area.key),
	})).filter(group => group.items.length > 0)

	if (grouped.length === 0) return null

	return (
		<>
			{grouped.map(group => (
				<Fragment key={group.area.key}>
					<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
						<div className='flex flex-1 flex-col gap-3'>
							<h2 className='text-3xl font-medium font-condensed tracking-tight'>
								{group.area.label}
							</h2>
						</div>
					</div>

					<div className='grid grid-cols-1 @md:grid-cols-2 gap-app'>
						{group.items.map(item => (
							<ToolkitCard key={item.id} item={item} />
						))}
					</div>
				</Fragment>
			))}
		</>
	)
}
