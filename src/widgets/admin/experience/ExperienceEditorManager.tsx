'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import { Badge, Button, Separator } from 'ui/blocks'
import { Checkbox, FormItem } from 'ui/forms'
import { Tooltip } from 'ui/floating'

import {
	Icon28AddOutline,
	Icon28ArrowLeftOutline,
	Icon28CancelOutline,
	Icon28DeleteOutline,
	Icon28EditOutline,
} from '@vkontakte/icons'

export function ExperienceEditorManager() {
	return (
		<>
			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							General
						</h2>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Company
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Select the company for the experience
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='experience-company'>
								<FormItem.Combobox
									mode='outline'
									size='md'
									options={[]}
									placeholder='Select company'
								/>
							</FormItem>

							<FormItem id='experience-employment-type'>
								<FormItem.Select
									mode='outline'
									size='md'
									options={[]}
									placeholder='Select employment type'
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Positions
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Add positions to the experience
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='experience-position'>
								<FormItem.Combobox
									mode='outline'
									size='md'
									options={[]}
									placeholder='Select position'
								/>
							</FormItem>

							<div className='flex items-center gap-2'>
								<FormItem id='experience-position' className='flex-1'>
									<FormItem.Combobox
										mode='outline'
										size='md'
										options={[]}
										placeholder='Select position'
									/>
								</FormItem>

								<Badge
									size='sm'
									mode='secondary'
									appearance='neutral'
									prefix={<Icon28CancelOutline width={12} height={12} />}
								/>
							</div>

							<Button
								className='w-full border-dashed'
								mode='outline'
								appearance='neutral'
								prefix={<Icon28AddOutline width={18} height={18} />}
								// suffix={<span>{relatedSlots.length}/3</span>}
								align='spread'
							>
								Add position
							</Button>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Summary
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Add a summary to the experience
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='experience-summary'>
								<FormItem.Textarea
									mode='outline'
									size='md'
									placeholder='Summary'
									resize='none'
									rows={3}
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Employment period
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Select the employment period for the experience
							</p>

							<div className='flex gap-2 select-none'>
								<Checkbox id='experience-present-time' />

								<label
									htmlFor='experience-present-time'
									className='text-sm font-medium'
								>
									Present time
								</label>
							</div>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<div className='grid grid-cols-2 gap-2'>
								<FormItem id='experience-start-month'>
									<FormItem.Select
										mode='outline'
										size='md'
										options={[]}
										placeholder='Month'
									/>
								</FormItem>

								<FormItem id='experience-start-year'>
									<FormItem.Input
										mode='outline'
										size='md'
										type='number'
										placeholder='Year'
									/>
								</FormItem>
							</div>

							{false && (
								<div className='grid grid-cols-2 gap-2'>
									<FormItem id='experience-start-month'>
										<FormItem.Select
											mode='outline'
											size='md'
											options={[]}
											placeholder='Month'
										/>
									</FormItem>

									<FormItem id='experience-start-year'>
										<FormItem.Input
											mode='outline'
											size='md'
											type='number'
											placeholder='Year'
										/>
									</FormItem>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Stickers
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Add stickers to the experience for better branding
							</p>
						</div>

						<div className='w-full @xl:w-2/5'>
							<div className='flex gap-2'>
								{[1, 2, 3].map(item => (
									<button
										key={item}
										type='button'
										className={twMerge(
											'relative size-14 flex items-center justify-center text-foreground-secondary bg-background hover:bg-surface-secondary border border-separator rounded-md overflow-hidden cursor-pointer transition-colors focus-ring-base focus-ring-visible',
											true && 'border-dashed',
										)}
									>
										{false ? (
											<>
												<Image
													src={''}
													alt={''}
													width={48}
													height={48}
													className='size-full object-cover'
												/>

												<Badge
													className='absolute top-1 right-1'
													size='sm'
													mode='secondary'
													appearance='neutral'
													prefix={<Icon28EditOutline width={12} height={12} />}
												/>
											</>
										) : (
											<Icon28AddOutline width={16} height={16} />
										)}
									</button>
								))}
							</div>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Taxonomies
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Add taxonomies to the article for better search and filtering
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='experience-skills'>
								<FormItem.Autocomplete
									mode='outline'
									size='md'
									options={[]}
									placeholder='Add skills'
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Connect article
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Select the article to connect to the experience
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='experience-article'>
								<FormItem.Combobox
									mode='outline'
									size='md'
									options={[]}
									placeholder='Select article'
								/>
							</FormItem>
						</div>
					</div>

					<Separator />

					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Ordering
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Place this article at the top or right after another one in the
								list
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='experience-ordering'>
								<FormItem.Combobox
									mode='outline'
									size='md'
									options={[]}
									placeholder='Select position'
								/>
							</FormItem>
						</div>
					</div>
				</div>

				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Danger zone
						</h2>
					</div>
				</div>

				<div className='flex flex-col bg-surface border border-separator rounded-surface outline-2 outline-offset-2 outline-danger'>
					<div className='flex flex-wrap p-surface gap-surface'>
						<div className='flex flex-1 flex-col gap-3'>
							<h3 className='text-xl font-medium font-condensed tracking-tight'>
								Delete experience
							</h3>
							<p className='text-sm text-foreground-secondary @xl:text-balance'>
								Permanently delete the experience and all associated data
							</p>
						</div>

						<div className='w-full @xl:w-fit flex flex-col gap-2'>
							<Button
								className='w-full'
								mode='secondary'
								appearance='danger'
								prefix={<Icon28DeleteOutline width={18} height={18} />}
								// onClick={openDelete}
								// disabled={pending}
							>
								Delete experience
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className='sticky bottom-app mx-auto max-w-sm w-full flex flex-col px-app gap-app'>
				<div className='flex flex-col bg-background border border-separator rounded-full overflow-hidden'>
					<div className='flex items-center p-2 gap-2'>
						<Tooltip text='Back to experiences'>
							<Button
								to='/admin/experience'
								mode='ghost'
								appearance='neutral'
								radius='rounded'
								prefix={<Icon28ArrowLeftOutline width={18} height={18} />}
								iconOnly
							/>
						</Tooltip>

						{true && (
							<AnimatePresence initial={false}>
								{true && (
									<motion.div
										key='discard-changes'
										initial={{ transform: 'translateX(-12px)', opacity: 0 }}
										animate={{ transform: 'translateX(0)', opacity: 1 }}
										exit={{ transform: 'translateX(-12px)', opacity: 0 }}
										transition={{
											transform: {
												type: 'tween',
												duration: 0.16,
												ease: 'easeInOut',
											},
											opacity: { duration: 0.16 },
										}}
										className='overflow-hidden'
									>
										<Button
											type='button'
											mode='secondary'
											appearance='neutral'
											radius='rounded'
											// onClick={discard}
											// disabled={pending}
										>
											Discard changes
										</Button>
									</motion.div>
								)}
							</AnimatePresence>
						)}

						<span className='flex-1' />

						{true ? (
							<Button
								type='button'
								radius='rounded'
								// onClick={() => save()}
								// disabled={pending || !isDirty}
							>
								Save changes
							</Button>
						) : (
							<Button
								type='button'
								radius='rounded'
								// onClick={() => save('published')}
								// disabled={pending}
							>
								Create
							</Button>
						)}
					</div>
				</div>
			</section>
		</>
	)
}
