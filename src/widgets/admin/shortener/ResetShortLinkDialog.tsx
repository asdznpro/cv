'use client'

import { useId, useState, useTransition } from 'react'

import { toast } from 'sonner'

import {
	DEFAULT_SHORTENER_RESET_RANGE,
	resetShortLinkStats,
	SHORTENER_RESET_RANGE_HINTS,
	SHORTENER_RESET_RANGE_LABELS,
	SHORTENER_RESET_RANGES,
	shortLinkHref,
	type ShortenerResetRange,
	type ShortLink,
} from 'lib/short-links'

import { Button } from 'ui/blocks'
import { Radio } from 'ui/forms'

type ResetShortLinkDialogProps = {
	link: ShortLink
	onCancel: () => void
	onSuccess: () => void
}

export function ResetShortLinkDialog({
	link,
	onCancel,
	onSuccess,
}: ResetShortLinkDialogProps) {
	const radioName = useId()
	const [pending, startTransition] = useTransition()
	const [range, setRange] = useState<ShortenerResetRange>(
		DEFAULT_SHORTENER_RESET_RANGE,
	)

	function confirm() {
		startTransition(async () => {
			const result = await resetShortLinkStats(link.id, range)
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success(
				`Stats reset (${SHORTENER_RESET_RANGE_HINTS[range].toLowerCase()})`,
			)
			onSuccess()
		})
	}

	return (
		<div className='flex flex-col bg-surface border border-separator rounded-surface'>
			<div className='flex flex-col p-surface gap-surface'>
				<div className='flex flex-1 flex-col gap-3'>
					<h3 className='text-xl font-medium font-condensed tracking-tight'>
						Reset link data?
					</h3>

					<p className='text-sm text-foreground-secondary'>
						Clicks and unique visitors for{' '}
						<span className='italic'>{shortLinkHref(link.slug)}</span> will be
						deleted. The redirect stays live.
					</p>
				</div>

				<div
					className='flex flex-col gap-app'
					role='radiogroup'
					aria-label='Reset period'
				>
					{SHORTENER_RESET_RANGES.map(value => {
						const id = `${radioName}-${value}`

						return (
							<label
								key={value}
								htmlFor={id}
								className='flex gap-3 select-none'
							>
								<Radio
									id={id}
									name={radioName}
									value={value}
									checked={range === value}
									onChange={() => setRange(value)}
									disabled={pending}
								/>

								<span className='flex flex-col gap-2'>
									<span className='font-medium font-condensed leading-5'>
										{SHORTENER_RESET_RANGE_LABELS[value]}{' '}
										<span className='text-foreground-secondary'>
											{SHORTENER_RESET_RANGE_HINTS[value]}
										</span>
									</span>
								</span>
							</label>
						)
					})}
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
						Yes, reset it
					</Button>
				</div>
			</div>
		</div>
	)
}
