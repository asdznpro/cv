'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import type { Company } from 'lib/companies'
import {
	EMPLOYMENT_TYPES,
	EXPERIENCE_POSITIONS,
	EXPERIENCE_SKILLS,
	MONTH_OPTIONS,
	applyExperiencePlacement,
	createExperience,
	dateFromYearMonth,
	isExperiencePosition,
	updateExperience,
	yearMonthFromDate,
	type EmploymentType,
	type Experience,
	type ExperienceInput,
	type ExperiencePosition,
	type ExperienceSticker,
} from 'lib/experience'

import { Badge, Button, Separator } from 'ui/blocks'
import { Checkbox, FormItem } from 'ui/forms'
import { Tooltip } from 'ui/floating'
import { useOverlay } from 'ui/overlays'

import {
	Icon28AddOutline,
	Icon28ArrowLeftOutline,
	Icon28CancelOutline,
	Icon28DeleteOutline,
	Icon28EditOutline,
} from '@vkontakte/icons'

import { DeleteExperienceDialog } from './DeleteExperienceDialog'
import { UploadStickerDialog } from './UploadStickerDialog'

type ArticleOption = {
	id: string
	title: string
}

type ExperienceOption = {
	id: string
	label: string
}

type FormState = {
	company_id: string
	employment_type: EmploymentType
	summary: string
	start_month: string
	start_year: string
	end_month: string
	end_year: string
	present: boolean
	stickers: Array<ExperienceSticker | null>
	skills: string[]
	article_id: string
}

const ORDER_TOP = '__top__'
const ARTICLE_NONE = '__none__'
const EMPTY_STICKERS: Array<ExperienceSticker | null> = [null, null, null]

const EMPLOYMENT_OPTIONS = EMPLOYMENT_TYPES.map(item => ({
	label: item.label,
	value: item.key,
}))

const POSITION_OPTIONS = EXPERIENCE_POSITIONS.map(item => ({
	label: item.label,
	value: item.key,
}))

const SKILL_OPTIONS = EXPERIENCE_SKILLS.map(value => ({
	label: value,
	value,
}))

function padStickers(stickers: ExperienceSticker[]) {
	return EMPTY_STICKERS.map((_, index) => stickers[index] ?? null)
}

function splitYearMonth(value: string | null | undefined) {
	const yearMonth = value ? yearMonthFromDate(value) : ''
	const [year = '', month = ''] = yearMonth.split('-')
	return { year, month }
}

function toFormState(experience: Experience): FormState {
	const start = splitYearMonth(experience.start_on)
	const end = splitYearMonth(experience.end_on)
	return {
		company_id: experience.company_id,
		employment_type: experience.employment_type,
		summary: experience.summary,
		start_month: start.month,
		start_year: start.year,
		end_month: end.month,
		end_year: end.year,
		present: !experience.end_on,
		stickers: padStickers(experience.stickers),
		skills: experience.skills,
		article_id: experience.article_id ?? ARTICLE_NONE,
	}
}

const EMPTY_FORM: FormState = {
	company_id: '',
	employment_type: 'full-time',
	summary: '',
	start_month: '',
	start_year: '',
	end_month: '',
	end_year: '',
	present: false,
	stickers: EMPTY_STICKERS,
	skills: [],
	article_id: ARTICLE_NONE,
}

function toInput(
	form: FormState,
	positions: Array<ExperiencePosition | ''>,
): ExperienceInput {
	return {
		company_id: form.company_id,
		employment_type: form.employment_type,
		positions: positions.filter(isExperiencePosition),
		summary: form.summary,
		start_on: dateFromYearMonth(form.start_year, form.start_month),
		end_on: form.present
			? null
			: dateFromYearMonth(form.end_year, form.end_month) || null,
		stickers: form.stickers.filter((item): item is ExperienceSticker =>
			Boolean(item?.url),
		),
		skills: form.skills,
		article_id:
			form.article_id && form.article_id !== ARTICLE_NONE
				? form.article_id
				: null,
	}
}

function getInitialPlaceAfter(
	experience: Experience | null,
	orderedIds: string[],
) {
	if (!experience) {
		return orderedIds.length > 0 ? orderedIds[orderedIds.length - 1] : ORDER_TOP
	}

	const index = orderedIds.indexOf(experience.id)
	if (index <= 0) return ORDER_TOP
	return orderedIds[index - 1]
}

type ExperienceEditorManagerProps = {
	experience: Experience | null
	companies: Company[]
	articles: ArticleOption[]
	experienceOptions: ExperienceOption[]
}

export function ExperienceEditorManager({
	experience,
	companies,
	articles,
	experienceOptions,
}: ExperienceEditorManagerProps) {
	const router = useRouter()
	const { open, close } = useOverlay()
	const [pending, startTransition] = useTransition()

	const initial = useMemo(
		() => (experience ? toFormState(experience) : EMPTY_FORM),
		[experience],
	)
	const orderedIds = useMemo(
		() => experienceOptions.map(item => item.id),
		[experienceOptions],
	)
	const initialPlaceAfter = useMemo(
		() => getInitialPlaceAfter(experience, orderedIds),
		[experience, orderedIds],
	)
	const initialPositions: Array<ExperiencePosition | ''> = experience?.positions
		?.length
		? experience.positions
		: ['']

	const [form, setForm] = useState<FormState>(initial)
	const [positions, setPositions] =
		useState<Array<ExperiencePosition | ''>>(initialPositions)
	const [experienceId, setExperienceId] = useState(experience?.id ?? null)
	const [placeAfterId, setPlaceAfterId] = useState(initialPlaceAfter)

	const companyOptions = companies.map(item => ({
		label: item.name,
		value: item.id,
	}))
	const articleOptions = [
		{ label: 'None', value: ARTICLE_NONE },
		...articles.map(item => ({
			label: item.title,
			value: item.id,
		})),
	]
	const orderingOptions = useMemo(() => {
		const afterOptions = experienceOptions
			.filter(item => item.id !== experienceId)
			.map(item => ({
				label: `After: ${item.label}`,
				value: item.id,
			}))
		return [{ label: 'Top of list', value: ORDER_TOP }, ...afterOptions]
	}, [experienceId, experienceOptions])

	const isDirty = useMemo(() => {
		if (placeAfterId !== initialPlaceAfter) return true
		if (JSON.stringify(positions) !== JSON.stringify(initialPositions)) {
			return true
		}
		return JSON.stringify(form) !== JSON.stringify(initial)
	}, [
		form,
		initial,
		initialPlaceAfter,
		initialPositions,
		placeAfterId,
		positions,
	])

	function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	function discard() {
		setForm(initial)
		setPositions(initialPositions)
		setPlaceAfterId(initialPlaceAfter)
		toast.message('Changes discarded')
	}

	function save() {
		const payload = toInput(form, positions)

		startTransition(async () => {
			const result = experienceId
				? await updateExperience(experienceId, payload)
				: await createExperience(payload)

			if (!result.ok) {
				toast.error(result.error)
				return
			}

			const id = result.experience?.id ?? experienceId
			if (id) {
				const placed = await applyExperiencePlacement(
					id,
					placeAfterId === ORDER_TOP ? null : placeAfterId,
				)
				if (!placed.ok) {
					toast.error(placed.error)
					return
				}
			}

			toast.success(experienceId ? 'Changes saved' : 'Experience created')

			if (!experienceId && id) {
				setExperienceId(id)
				router.replace(`/admin/experience/${id}`)
				return
			}

			router.refresh()
		})
	}

	function openSticker(index: number) {
		open(
			<UploadStickerDialog
				experienceId={experienceId ?? undefined}
				sticker={form.stickers[index]}
				onCancel={close}
				onSave={next => {
					setForm(prev => {
						const stickers = [...prev.stickers]
						stickers[index] = next
						return { ...prev, stickers }
					})
					close()
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	function openDelete() {
		if (!experience) return
		open(
			<DeleteExperienceDialog
				experience={experience}
				onCancel={close}
				onSuccess={() => {
					close()
					router.push('/admin/experience')
					router.refresh()
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

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
									options={companyOptions}
									value={form.company_id}
									onValueChange={value => setField('company_id', value)}
									placeholder='Select company'
									disabled={pending}
								/>
							</FormItem>

							<FormItem id='experience-employment-type'>
								<FormItem.Select
									mode='outline'
									size='md'
									options={EMPLOYMENT_OPTIONS}
									value={form.employment_type}
									onValueChange={value =>
										setField('employment_type', value as EmploymentType)
									}
									placeholder='Select employment type'
									disabled={pending}
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
							{positions.map((position, index) => {
								const options = POSITION_OPTIONS.filter(
									option =>
										option.value === position ||
										!positions.includes(option.value as ExperiencePosition),
								)

								return (
									<div key={index} className='flex items-center gap-2'>
										<FormItem
											id={`experience-position-${index}`}
											className='flex-1'
										>
											<FormItem.Select
												mode='outline'
												size='md'
												options={options}
												value={position}
												onValueChange={value => {
													setPositions(prev =>
														prev.map((item, itemIndex) =>
															itemIndex === index
																? (value as ExperiencePosition)
																: item,
														),
													)
												}}
												placeholder='Select position'
												disabled={pending}
											/>
										</FormItem>

										{index > 0 && (
											<Badge
												size='sm'
												mode='secondary'
												appearance='neutral'
												prefix={<Icon28CancelOutline width={12} height={12} />}
												onClick={() =>
													setPositions(prev =>
														prev.filter((_, itemIndex) => itemIndex !== index),
													)
												}
											/>
										)}
									</div>
								)
							})}

							<Button
								className='w-full border-dashed'
								mode='outline'
								appearance='neutral'
								prefix={<Icon28AddOutline width={18} height={18} />}
								suffix={<span>{positions.length}/3</span>}
								align='spread'
								disabled={pending || positions.length >= 3}
								onClick={() => {
									if (positions.length >= 3) return
									setPositions(prev => [...prev, ''])
								}}
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
									value={form.summary}
									onChange={event =>
										setField(
											'summary',
											(event.target as HTMLTextAreaElement).value,
										)
									}
									disabled={pending}
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
								<Checkbox
									id='experience-present-time'
									checked={form.present}
									onChange={event =>
										setField(
											'present',
											(event.target as HTMLInputElement).checked,
										)
									}
									disabled={pending}
								/>

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
										options={[...MONTH_OPTIONS]}
										value={form.start_month}
										onValueChange={value => setField('start_month', value)}
										placeholder='Month'
										disabled={pending}
									/>
								</FormItem>

								<FormItem id='experience-start-year'>
									<FormItem.Input
										mode='outline'
										size='md'
										type='number'
										placeholder='Year'
										value={form.start_year}
										onChange={event =>
											setField(
												'start_year',
												(event.target as HTMLInputElement).value,
											)
										}
										disabled={pending}
									/>
								</FormItem>
							</div>

							{!form.present && (
								<div className='grid grid-cols-2 gap-2'>
									<FormItem id='experience-end-month'>
										<FormItem.Select
											mode='outline'
											size='md'
											options={[...MONTH_OPTIONS]}
											value={form.end_month}
											onValueChange={value => setField('end_month', value)}
											placeholder='Month'
											disabled={pending}
										/>
									</FormItem>

									<FormItem id='experience-end-year'>
										<FormItem.Input
											mode='outline'
											size='md'
											type='number'
											placeholder='Year'
											value={form.end_year}
											onChange={event =>
												setField(
													'end_year',
													(event.target as HTMLInputElement).value,
												)
											}
											disabled={pending}
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
							<div className='flex @xl:grid grid-cols-4 gap-2'>
								{form.stickers.map((sticker, index) => (
									<button
										key={index}
										type='button'
										onClick={() => openSticker(index)}
										disabled={pending}
										className={twMerge(
											'relative max-w-16 w-full aspect-square flex items-center justify-center text-foreground-secondary bg-background hover:bg-surface-secondary border border-separator rounded-md overflow-hidden cursor-pointer transition-colors focus-ring-base focus-ring-visible',
											!sticker && 'border-dashed',
										)}
									>
										{sticker ? (
											<>
												<Image
													src={sticker.url}
													alt=''
													width={48}
													height={48}
													unoptimized
													className='size-full object-contain'
													style={{ transform: `rotate(${sticker.rotate}deg)` }}
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
								Add skills for filtering and public tags
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='experience-skills'>
								<FormItem.Autocomplete
									mode='outline'
									size='md'
									options={SKILL_OPTIONS}
									value={form.skills}
									onValueChange={value => setField('skills', value)}
									placeholder='Add skills'
									disabled={pending}
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
									options={articleOptions}
									value={form.article_id}
									onValueChange={value => setField('article_id', value)}
									placeholder='Select article'
									disabled={pending}
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
								Place this experience at the top or right after another one
							</p>
						</div>

						<div className='w-full @xl:w-2/5 flex flex-col gap-2'>
							<FormItem id='experience-ordering'>
								<FormItem.Combobox
									mode='outline'
									size='md'
									options={orderingOptions}
									value={placeAfterId}
									onValueChange={setPlaceAfterId}
									placeholder='Select position'
									disabled={pending}
								/>
							</FormItem>
						</div>
					</div>
				</div>

				{experienceId && (
					<>
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
										onClick={openDelete}
										disabled={pending}
									>
										Delete experience
									</Button>
								</div>
							</div>
						</div>
					</>
				)}
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

						{experienceId && (
							<AnimatePresence initial={false}>
								{isDirty && (
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
											onClick={discard}
											disabled={pending}
										>
											Discard changes
										</Button>
									</motion.div>
								)}
							</AnimatePresence>
						)}

						<span className='flex-1' />

						<Button
							type='button'
							radius='rounded'
							onClick={save}
							disabled={pending || (Boolean(experienceId) && !isDirty)}
						>
							{experienceId ? 'Save changes' : 'Create experience'}
						</Button>
					</div>
				</div>
			</section>
		</>
	)
}
