'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import {
	listShortLinkVisits,
	shortLinkHref,
	type ShortLink,
	type ShortLinkVisit,
} from 'lib/short-links'
import { getFormattedDate } from 'lib/utils'

import { Badge, Button, ScrollArea, Separator, Spinner } from 'ui/blocks'

import {
	Icon28ChevronDownOutline,
	Icon28HandPointUpOutline,
} from '@vkontakte/icons'

type ShortLinkVisitsDialogProps = {
	link: ShortLink
	onClose: () => void
}

function visitPlace(visit: ShortLinkVisit) {
	const parts = [visit.country, visit.city].filter(Boolean)
	return parts.length > 0 ? parts.join(' · ') : 'Unknown location'
}

function visitAgent(visit: ShortLinkVisit) {
	const parts = [visit.browser, visit.os, visit.device].filter(
		value => value && value !== 'Unknown',
	)
	return parts.join(' · ')
}

function isTelegramVisit(visit: ShortLinkVisit) {
	return (visit.as_org ?? '').toLowerCase().includes('telegram')
}

export function ShortLinkVisitsDialog({
	link,
	onClose,
}: ShortLinkVisitsDialogProps) {
	const [visits, setVisits] = useState<ShortLinkVisit[] | null>(null)
	const [openId, setOpenId] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false

		void listShortLinkVisits(link.id).then(result => {
			if (cancelled) return

			if (!result.ok) {
				toast.error(result.error)
				setVisits([])
				return
			}

			setVisits(result.visits)
		})

		return () => {
			cancelled = true
		}
	}, [link.id])

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<p className='text-xl font-medium font-condensed tracking-tight'>
						Visits
						{link.title ? (
							<>
								{' '}
								of{' '}
								<span className='text-foreground-secondary'>{link.title}</span>
							</>
						) : null}
					</p>

					<p className='flex items-center gap-1 text-sm text-foreground-secondary'>
						{shortLinkHref(link.slug)} ·{' '}
						{visits === null && (
							<Spinner size={20} className='text-foreground-secondary' />
						)}
						{visits === null
							? 'Loading uniques…'
							: visits.length === 1
								? '1 unique visitor'
								: `${visits.length} unique visitors`}
					</p>
				</div>
			</div>

			<Separator />

			{visits === null ? (
				<div className='min-h-40 flex items-center justify-center p-surface bg-background'>
					<Spinner size={20} className='text-foreground-secondary' />
				</div>
			) : visits.length === 0 ? (
				<div className='min-h-40 flex items-center justify-center p-surface bg-background'>
					<p className='text-center text-sm text-foreground-secondary'>
						No unique visitors yet
					</p>
				</div>
			) : (
				<ScrollArea className='max-h-[min(60dvh,32rem)] bg-background'>
					{visits.map((visit, index) => {
						const agent = visitAgent(visit)
						const open = openId === visit.id

						return (
							<div key={visit.id}>
								<div
									className='flex p-surface gap-surface cursor-pointer'
									onClick={() =>
										setOpenId(current =>
											current === visit.id ? null : visit.id,
										)
									}
								>
									<div className='flex flex-1 flex-col gap-3 min-w-0'>
										<p className='text-balance text-xl font-medium font-condensed tracking-tight'>
											{visitPlace(visit)}
										</p>

										<span className='flex flex-wrap gap-1'>
											<Badge
												size='md'
												mode='soft'
												appearance='neutral'
												prefix={
													<Icon28HandPointUpOutline width={14} height={14} />
												}
											>
												{visit.hits}
											</Badge>

											<Badge size='md' mode='soft' appearance='neutral'>
												{
													getFormattedDate(visit.last_seen_at, {
														includeTime: true,
													}).relative
												}
											</Badge>

											{isTelegramVisit(visit) && (
												<Badge size='md' mode='soft' appearance='neutral'>
													Telegram
												</Badge>
											)}

											{agent && (
												<Badge size='md' mode='soft' appearance='neutral'>
													{agent}
												</Badge>
											)}
										</span>
									</div>

									<Button
										type='button'
										mode='ghost'
										appearance='neutral'
										prefix={
											<Icon28ChevronDownOutline
												className={twMerge(
													'transition-transform duration-200',
													open && 'rotate-180',
												)}
												width={18}
												height={18}
											/>
										}
										iconOnly
									/>
								</div>

								<AnimatePresence initial={false}>
									{open && (
										<motion.div
											key={`clicks-${visit.id}`}
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: 'auto', opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{
												height: {
													type: 'tween',
													duration: 0.16,
													ease: 'easeInOut',
												},
												opacity: { duration: 0.16 },
											}}
											className='overflow-hidden'
										>
											<div className='flex flex-col p-1 pt-0 gap-1'>
												{visit.clicks.length === 0 ? (
													<div className='flex justify-center p-3 gap-3 rounded-md bg-surface-secondary text-sm text-foreground-secondary'>
														No click events
													</div>
												) : (
													visit.clicks.map((click, clickIndex) => (
														<div
															key={click.id}
															className='flex items-center p-3 gap-3 rounded-md bg-surface-secondary text-sm'
														>
															<span className='w-4.5 text-foreground-secondary font-mono'>
																{visit.clicks.length - clickIndex}
															</span>

															<span className='flex-1 min-w-0'>
																{
																	getFormattedDate(click.created_at, {
																		includeTime: true,
																	}).full
																}
															</span>

															<span className='text-foreground-secondary'>
																{
																	getFormattedDate(click.created_at, {
																		includeTime: true,
																	}).relative
																}
															</span>
														</div>
													))
												)}
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								{index !== visits.length - 1 && <Separator />}
							</div>
						)
					})}
				</ScrollArea>
			)}

			<Separator />

			<div className='flex justify-end p-surface gap-surface'>
				<Button
					size='sm'
					type='button'
					mode='secondary'
					appearance='neutral'
					onClick={onClose}
				>
					Close
				</Button>
			</div>
		</div>
	)
}
