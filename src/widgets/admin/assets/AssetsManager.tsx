'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import {
	breadcrumbSegments,
	createFolderAction,
	deleteAssetsAction,
	deleteFolderAction,
	hrefForAssetsPrefix,
	parentPrefix,
	renameAssetAction,
	uploadAssetAction,
	type AssetListResult,
} from 'lib/r2'
import { getFormattedDate } from 'lib/utils'

import {
	Badge,
	Button,
	MiddleTruncate,
	PreviewCard,
	Separator,
} from 'ui/blocks'
import { Checkbox, FormItem } from 'ui/forms'
import { ContextMenu, DropdownMenu } from 'ui/floating'
import { useOverlay } from 'ui/overlays'

import {
	Icon24List,
	Icon24Squareshape4GridOutline,
	Icon28AddOutline,
	Icon28ArrowUpOutline,
	Icon28Cancel,
	Icon28ChevronDownOutline,
	Icon28CopyOutline,
	Icon28DeleteOutline,
	Icon28DoneOutline,
	Icon28EditOutline,
	Icon28FolderOutline,
	Icon28MoreHorizontal,
	Icon28PictureOutline,
	Icon28Rectangle2Outline,
	Icon28UploadOutline,
	Icon28ViewOutline,
} from '@vkontakte/icons'

import { CreateFolderDialog } from './CreateFolderDialog'
import { DeleteAssetDialog } from './DeleteAssetDialog'
import { RenameAssetDialog } from './RenameAssetDialog'

function formatBytes(size: number) {
	if (size < 1024) return `${size} B`
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
	return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function isImageName(name: string) {
	return /\.(png|jpe?g|gif|webp|svg)$/i.test(name)
}

type AssetsView = 'list' | 'compact-list' | 'grid'

const ASSETS_VIEW_KEY = 'cv.admin.assets.view'

function readAssetsView(): AssetsView {
	if (typeof window === 'undefined') return 'list'
	return window.localStorage.getItem(ASSETS_VIEW_KEY) === 'grid'
		? 'grid'
		: window.localStorage.getItem(ASSETS_VIEW_KEY) === 'compact-list'
			? 'compact-list'
			: 'list'
}

type AssetsManagerProps = {
	initial: AssetListResult
}

export function AssetsManager({ initial }: AssetsManagerProps) {
	const router = useRouter()
	const { open, close } = useOverlay()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [list, setList] = useState(initial)
	const [pending, startTransition] = useTransition()
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [view, setView] = useState<AssetsView>('list')

	useEffect(() => {
		setView(readAssetsView())
	}, [])

	useEffect(() => {
		setList(initial)
		setSelectedIds([])
	}, [initial])

	function setAssetsView(next: AssetsView) {
		setView(next)
		window.localStorage.setItem(ASSETS_VIEW_KEY, next)
	}

	const crumbs = breadcrumbSegments(list.prefix)
	const parent = parentPrefix(list.prefix)

	function refresh() {
		startTransition(() => {
			router.refresh()
		})
	}

	function openFolder(prefix: string) {
		startTransition(() => {
			router.push(hrefForAssetsPrefix(prefix))
		})
	}

	function openCreateFolder() {
		open(
			<CreateFolderDialog
				onCancel={() => close()}
				onSubmit={name => {
					startTransition(async () => {
						const result = await createFolderAction(list.prefix, name)
						if (!result.ok) {
							toast.error(result.error)
							return
						}
						toast.success('Folder created')
						close()
						refresh()
					})
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	function confirmDeleteFile(key: string, name: string) {
		open(
			<DeleteAssetDialog
				title='Delete file?'
				description={`«${name}» will be removed from CDN.`}
				onCancel={() => close()}
				onConfirm={() => {
					startTransition(async () => {
						const result = await deleteAssetsAction([key])
						if (!result.ok) {
							toast.error(result.error)
							return
						}
						toast.success('File deleted')
						close()
						refresh()
					})
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	function openRenameFile(key: string, name: string) {
		open(
			<RenameAssetDialog
				initialName={name}
				onCancel={() => close()}
				onSubmit={nextName => {
					startTransition(async () => {
						const result = await renameAssetAction(key, nextName)
						if (!result.ok) {
							toast.error(result.error)
							return
						}
						toast.success('File renamed')
						close()
						refresh()
					})
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	function confirmDeleteFolder(prefix: string, name: string) {
		open(
			<DeleteAssetDialog
				title='Delete folder?'
				description={`«${name}» and everything inside will be permanently deleted.`}
				onCancel={() => close()}
				onConfirm={() => {
					startTransition(async () => {
						const result = await deleteFolderAction(prefix)
						if (!result.ok) {
							toast.error(result.error)
							return
						}
						toast.success('Folder deleted')
						close()
						refresh()
					})
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	async function copyUrl(url: string) {
		try {
			await navigator.clipboard.writeText(url)
			toast.success('CDN URL copied')
		} catch {
			toast.error('Could not copy')
		}
	}

	function onUploadPick(files: FileList | null) {
		const file = files?.[0]
		if (!file) return

		startTransition(async () => {
			const formData = new FormData()
			formData.set('file', file)
			formData.set('prefix', list.prefix)

			const result = await uploadAssetAction(formData)
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success('Uploaded')
			refresh()
			if (fileInputRef.current) fileInputRef.current.value = ''
		})
	}

	const isEmpty = list.folders.length === 0 && list.files.length === 0
	const pageIds = [
		...list.folders.map(folder => folder.prefix),
		...list.files.map(file => file.key),
	]
	const pageSelected =
		pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id))
	const somePageSelected =
		pageIds.some(id => selectedIds.includes(id)) && !pageSelected

	function togglePage() {
		setSelectedIds(prev => {
			if (pageSelected) return prev.filter(id => !pageIds.includes(id))
			return [...new Set([...prev, ...pageIds])]
		})
	}

	function toggleOne(id: string) {
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
		)
	}

	function selectAllOnPage() {
		setSelectedIds(pageIds)
	}

	async function deleteSelected(ids: string[]) {
		const folders = ids.filter(id => id.endsWith('/'))
		const files = ids.filter(id => !id.endsWith('/'))

		if (files.length) {
			const result = await deleteAssetsAction(files)
			if (!result.ok) return result
		}

		for (const prefix of folders) {
			const result = await deleteFolderAction(prefix)
			if (!result.ok) return result
		}

		return { ok: true as const }
	}

	function onBulkDelete() {
		const count = selectedIds.length
		const folders = selectedIds.filter(id => id.endsWith('/')).length

		open(
			<DeleteAssetDialog
				title={count === 1 ? 'Delete item?' : `Delete ${count} items?`}
				description={
					folders > 0
						? 'Selected folders will be removed with everything inside.'
						: 'Selected files will be removed from CDN.'
				}
				onCancel={() => close()}
				onConfirm={() => {
					startTransition(async () => {
						const result = await deleteSelected(selectedIds)
						if (!result.ok) {
							toast.error(result.error)
							return
						}
						toast.success(count === 1 ? 'Item deleted' : `Deleted: ${count}`)
						setSelectedIds([])
						close()
						refresh()
					})
				}}
			/>,
			{ className: 'max-w-sm' },
		)
	}

	return (
		<>
			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						Assets
					</h1>

					<p className='text-foreground-secondary text-balance'>
						Browse, upload and organize files in Cloudflare R2. Public URLs are
						served from the CDN.
					</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<input
						ref={fileInputRef}
						type='file'
						className='hidden'
						onChange={event => onUploadPick(event.target.files)}
					/>

					<Button
						size='sm'
						appearance='accent'
						prefix={<Icon28UploadOutline width={16} height={16} />}
						onClick={() => fileInputRef.current?.click()}
						disabled={pending}
					>
						Upload
					</Button>

					<Button
						size='sm'
						mode='secondary'
						appearance='neutral'
						prefix={<Icon28AddOutline width={16} height={16} />}
						onClick={openCreateFolder}
						disabled={pending}
					>
						New folder
					</Button>

					{parent !== null && (
						<Button
							size='sm'
							mode='ghost'
							appearance='neutral'
							prefix={<Icon28ArrowUpOutline width={16} height={16} />}
							onClick={() => openFolder(parent)}
							disabled={pending}
						>
							Up
						</Button>
					)}
				</div>
			</section>

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex flex-col bg-background border border-separator rounded-surface overflow-hidden'>
					<div className='flex flex-col bg-surface'>
						<AnimatePresence initial={false}>
							{selectedIds.length > 0 && (
								<motion.div
									key='assets-bulk-toolbar'
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
									<div className='flex flex-col p-2 pb-0 gap-2'>
										<div className='group flex p-2 gap-2 rounded-md bg-surface-secondary'>
											<Button
												onClick={selectAllOnPage}
												type='button'
												size='sm'
												mode='ghost'
												appearance='neutral'
												disabled={pending || pageSelected}
											>
												{pageSelected ? 'All selected' : 'Select all'}
											</Button>

											<Separator orientation='vertical' />

											<Button
												type='button'
												size='sm'
												mode='ghost'
												appearance='danger'
												disabled={pending}
												prefix={<Icon28DeleteOutline width={16} height={16} />}
												onClick={onBulkDelete}
											>
												Delete
											</Button>

											<span className='flex-1' />

											<Button
												onClick={() => setSelectedIds([])}
												type='button'
												size='sm'
												mode='ghost'
												appearance='neutral'
												prefix={<Icon28Cancel width={16} height={16} />}
											/>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						<div className='h-12 flex items-center px-surface gap-surface'>
							<Checkbox
								aria-label='Select all items'
								checked={pageSelected}
								indeterminate={somePageSelected}
								onChange={togglePage}
								disabled={isEmpty}
							/>

							<span className='flex flex-1 min-w-0 items-center gap-1 text-foreground-secondary text-sm'>
								{selectedIds.length > 0 ? (
									`${selectedIds.length} selected`
								) : (
									<>
										<button
											type='button'
											className='shrink-0 hover:text-foreground transition-colors cursor-pointer'
											onClick={() => openFolder('')}
											disabled={pending}
										>
											root
										</button>

										{crumbs.map((crumb, index) => {
											const isLast = index === crumbs.length - 1

											return (
												<span
													key={crumb.prefix}
													className='flex items-center gap-1 min-w-0'
												>
													<span className='shrink-0 select-none'>/</span>

													<button
														type='button'
														className='max-w-32 min-w-0 hover:text-foreground transition-colors cursor-pointer'
														onClick={() => openFolder(crumb.prefix)}
														disabled={pending}
													>
														{isLast ? (
															<MiddleTruncate value={crumb.label} />
														) : (
															crumb.label
														)}
													</button>
												</span>
											)
										})}
									</>
								)}
							</span>

							<DropdownMenu>
								<DropdownMenu.Trigger>
									<Button
										type='button'
										size='sm'
										mode='secondary'
										appearance='neutral'
										prefix={
											view === 'grid' ? (
												<Icon24Squareshape4GridOutline width={16} height={16} />
											) : view === 'compact-list' ? (
												<Icon24List width={16} height={16} />
											) : (
												<Icon28Rectangle2Outline width={16} height={16} />
											)
										}
										suffix={<Icon28ChevronDownOutline width={16} height={16} />}
									/>
								</DropdownMenu.Trigger>

								<DropdownMenu.Content className='w-40'>
									<DropdownMenu.Box>
										<DropdownMenu.Heading>View</DropdownMenu.Heading>

										<DropdownMenu.Item
											aria-label='Compact list view'
											onClick={() => setAssetsView('compact-list')}
											mode={view === 'compact-list' ? 'secondary' : 'ghost'}
											prefix={<Icon24List width={18} height={18} />}
											suffix={
												view === 'compact-list' && (
													<Icon28DoneOutline width={18} height={18} />
												)
											}
										>
											Compact list
										</DropdownMenu.Item>

										<DropdownMenu.Item
											aria-label='List view'
											onClick={() => setAssetsView('list')}
											mode={view === 'list' ? 'secondary' : 'ghost'}
											prefix={
												<Icon28Rectangle2Outline width={18} height={18} />
											}
											suffix={
												view === 'list' && (
													<Icon28DoneOutline width={18} height={18} />
												)
											}
										>
											List
										</DropdownMenu.Item>

										<DropdownMenu.Item
											aria-label='Grid view'
											onClick={() => setAssetsView('grid')}
											mode={view === 'grid' ? 'secondary' : 'ghost'}
											prefix={
												<Icon24Squareshape4GridOutline width={18} height={18} />
											}
											suffix={
												view === 'grid' && (
													<Icon28DoneOutline width={18} height={18} />
												)
											}
										>
											Grid
										</DropdownMenu.Item>
									</DropdownMenu.Box>
								</DropdownMenu.Content>
							</DropdownMenu>
						</div>
					</div>

					<Separator />

					<div className='relative flex flex-col'>
						{isEmpty ? (
							<div className='min-h-40 flex items-center justify-center p-surface'>
								<p className='text-center text-sm text-foreground-secondary'>
									This folder is empty
								</p>
							</div>
						) : view === 'compact-list' ? (
							<div className='flex flex-col'>
								{list.folders.map(folder => (
									<div
										key={folder.prefix}
										className={twMerge(
											'group flex flex-col not-last:border-b border-separator hover:bg-surface transition-colors',
											selectedIds.includes(folder.prefix) && 'bg-surface',
										)}
									>
										<div className='flex p-surface gap-surface'>
											<Checkbox
												className='my-auto'
												aria-label={`Select ${folder.name}`}
												checked={selectedIds.includes(folder.prefix)}
												onChange={() => toggleOne(folder.prefix)}
											/>

											<div className='min-w-0 min-h-full flex-1 flex flex-col justify-center gap-2'>
												<div className='text-sm grid grid-cols-4 gap-app'>
													<div className='col-span-2 flex gap-2'>
														<Icon28FolderOutline
															className='text-foreground-secondary'
															width={20}
															height={20}
														/>

														<button
															type='button'
															className='max-w-full w-fit text-left font-medium font-condensed tracking-tight hover:underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link rounded cursor-pointer'
															onClick={() => openFolder(folder.prefix)}
															disabled={pending}
														>
															<MiddleTruncate value={folder.name} />
														</button>
													</div>

													<div className='text-foreground-secondary font-condensed tracking-tight'>
														Folder
													</div>
												</div>
											</div>

											<div className='flex gap-2'>
												<DropdownMenu>
													<DropdownMenu.Trigger>
														<Button
															size='sm'
															mode='ghost'
															appearance='neutral'
															prefix={
																<Icon28MoreHorizontal width={16} height={16} />
															}
															iconOnly
															disabled={pending}
														/>
													</DropdownMenu.Trigger>

													<DropdownMenu.Content className='w-36'>
														<DropdownMenu.Box>
															<DropdownMenu.Item
																aria-label='Open folder'
																prefix={
																	<Icon28FolderOutline width={18} height={18} />
																}
																onClick={() => openFolder(folder.prefix)}
															>
																Open
															</DropdownMenu.Item>

															<DropdownMenu.Item
																aria-label='Delete folder'
																appearance='danger'
																prefix={
																	<Icon28DeleteOutline width={18} height={18} />
																}
																onClick={() =>
																	confirmDeleteFolder(
																		folder.prefix,
																		folder.name,
																	)
																}
															>
																Delete
															</DropdownMenu.Item>
														</DropdownMenu.Box>
													</DropdownMenu.Content>
												</DropdownMenu>
											</div>
										</div>
									</div>
								))}

								{list.files.map(file => (
									<div
										key={file.key}
										className={twMerge(
											'group flex flex-col not-last:border-b border-separator hover:bg-surface transition-colors',
											selectedIds.includes(file.key) && 'bg-surface',
										)}
									>
										<div className='flex p-surface gap-surface'>
											<Checkbox
												className='my-auto'
												aria-label={`Select ${file.name}`}
												checked={selectedIds.includes(file.key)}
												onChange={() => toggleOne(file.key)}
											/>

											<div className='min-w-0 min-h-full flex-1 flex flex-col justify-center gap-2'>
												<div className='text-sm grid grid-cols-4 gap-app'>
													<a
														href={file.url}
														target='_blank'
														rel='noreferrer'
														className='root max-w-full w-fit font-medium font-condensed tracking-tight hover:underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link rounded col-span-2'
													>
														<MiddleTruncate value={file.name} />
													</a>

													<div className='text-foreground-secondary font-condensed tracking-tight'>
														{formatBytes(file.size)}
													</div>

													{file.lastModified && (
														<div className='text-foreground-secondary font-condensed tracking-tight'>
															{getFormattedDate(file.lastModified).short}
														</div>
													)}
												</div>
											</div>

											<div className='flex gap-2'>
												<DropdownMenu>
													<DropdownMenu.Trigger>
														<Button
															size='sm'
															mode='ghost'
															appearance='neutral'
															prefix={
																<Icon28MoreHorizontal width={16} height={16} />
															}
															iconOnly
															disabled={pending}
														/>
													</DropdownMenu.Trigger>

													<DropdownMenu.Content className='w-40'>
														<DropdownMenu.Box>
															<DropdownMenu.Item
																aria-label='Open file'
																href={file.url}
																target='_blank'
																prefix={
																	<Icon28ViewOutline width={18} height={18} />
																}
															>
																Open
															</DropdownMenu.Item>

															<DropdownMenu.Item
																aria-label='Copy CDN URL'
																prefix={
																	<Icon28CopyOutline width={18} height={18} />
																}
																onClick={() => copyUrl(file.url)}
															>
																Copy URL
															</DropdownMenu.Item>

															<DropdownMenu.Item
																aria-label='Rename file'
																prefix={
																	<Icon28EditOutline width={18} height={18} />
																}
																onClick={() =>
																	openRenameFile(file.key, file.name)
																}
															>
																Rename
															</DropdownMenu.Item>

															<DropdownMenu.Item
																aria-label='Delete file'
																appearance='danger'
																prefix={
																	<Icon28DeleteOutline width={18} height={18} />
																}
																onClick={() =>
																	confirmDeleteFile(file.key, file.name)
																}
															>
																Delete
															</DropdownMenu.Item>
														</DropdownMenu.Box>
													</DropdownMenu.Content>
												</DropdownMenu>
											</div>
										</div>
									</div>
								))}
							</div>
						) : view === 'list' ? (
							<div className='flex flex-col'>
								{list.folders.map(folder => (
									<div
										key={folder.prefix}
										className={twMerge(
											'group flex flex-col not-last:border-b border-separator hover:bg-surface transition-colors',
											selectedIds.includes(folder.prefix) && 'bg-surface',
										)}
									>
										<div className='flex p-surface gap-surface'>
											<Checkbox
												className='my-auto'
												aria-label={`Select ${folder.name}`}
												checked={selectedIds.includes(folder.prefix)}
												onChange={() => toggleOne(folder.prefix)}
											/>

											<PreviewCard
												className='w-14'
												placeholder={
													<Icon28FolderOutline width={28} height={28} />
												}
												ratio='square'
												radius='full'
												sizes='(max-width: 1240px) 100vw, 1240px'
											/>

											<div className='min-w-0 min-h-full flex-1 flex flex-col justify-center gap-2'>
												<button
													type='button'
													className='max-w-full w-fit text-left text-xl font-medium font-condensed tracking-tight hover:underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link rounded cursor-pointer'
													onClick={() => openFolder(folder.prefix)}
													disabled={pending}
												>
													<MiddleTruncate value={folder.name} />
												</button>

												<span className='flex flex-wrap gap-1'>
													<Badge size='sm' mode='soft' appearance='neutral'>
														Folder
													</Badge>
												</span>
											</div>

											<div className='flex gap-2'>
												<DropdownMenu>
													<DropdownMenu.Trigger>
														<Button
															mode='ghost'
															appearance='neutral'
															prefix={
																<Icon28MoreHorizontal width={18} height={18} />
															}
															iconOnly
															disabled={pending}
														/>
													</DropdownMenu.Trigger>

													<DropdownMenu.Content className='w-32'>
														<DropdownMenu.Box>
															<DropdownMenu.Item
																aria-label='Open folder'
																prefix={
																	<Icon28FolderOutline width={18} height={18} />
																}
																onClick={() => openFolder(folder.prefix)}
															>
																Open
															</DropdownMenu.Item>

															<DropdownMenu.Item
																aria-label='Delete folder'
																appearance='danger'
																prefix={
																	<Icon28DeleteOutline width={18} height={18} />
																}
																onClick={() =>
																	confirmDeleteFolder(
																		folder.prefix,
																		folder.name,
																	)
																}
															>
																Delete
															</DropdownMenu.Item>
														</DropdownMenu.Box>
													</DropdownMenu.Content>
												</DropdownMenu>
											</div>
										</div>
									</div>
								))}

								{list.files.map(file => (
									<div
										key={file.key}
										className={twMerge(
											'group flex flex-col not-last:border-b border-separator hover:bg-surface transition-colors',
											selectedIds.includes(file.key) && 'bg-surface',
										)}
									>
										<div className='flex p-surface gap-surface'>
											<Checkbox
												className='my-auto'
												aria-label={`Select ${file.name}`}
												checked={selectedIds.includes(file.key)}
												onChange={() => toggleOne(file.key)}
											/>

											<PreviewCard
												className='w-14'
												ratio='square'
												src={file.url}
												alt={file.name}
												radius='sm'
												sizes='(max-width: 1240px) 100vw, 1240px'
											/>

											<div className='min-w-0 min-h-full flex-1 flex flex-col justify-center gap-2'>
												<a
													href={file.url}
													target='_blank'
													rel='noreferrer'
													className='root max-w-full w-fit text-xl font-medium font-condensed tracking-tight hover:underline underline-offset-6 transition-colors hover:text-link focus-visible:text-link rounded'
												>
													<MiddleTruncate value={file.name} />
												</a>

												<span className='flex flex-wrap gap-1'>
													<Badge size='sm' mode='soft' appearance='neutral'>
														{formatBytes(file.size)}
													</Badge>

													{file.lastModified && (
														<Badge size='sm' mode='soft' appearance='neutral'>
															{getFormattedDate(file.lastModified).short}
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
															prefix={
																<Icon28MoreHorizontal width={18} height={18} />
															}
															iconOnly
															disabled={pending}
														/>
													</DropdownMenu.Trigger>

													<DropdownMenu.Content className='w-32'>
														<DropdownMenu.Box>
															<DropdownMenu.Item
																aria-label='Open file'
																href={file.url}
																target='_blank'
																prefix={
																	<Icon28ViewOutline width={18} height={18} />
																}
															>
																Open
															</DropdownMenu.Item>

															<DropdownMenu.Item
																aria-label='Copy CDN URL'
																prefix={
																	<Icon28CopyOutline width={18} height={18} />
																}
																onClick={() => copyUrl(file.url)}
															>
																Copy URL
															</DropdownMenu.Item>

															<DropdownMenu.Item
																aria-label='Rename file'
																prefix={
																	<Icon28EditOutline width={18} height={18} />
																}
																onClick={() =>
																	openRenameFile(file.key, file.name)
																}
															>
																Rename
															</DropdownMenu.Item>

															<DropdownMenu.Item
																aria-label='Delete file'
																appearance='danger'
																prefix={
																	<Icon28DeleteOutline width={18} height={18} />
																}
																onClick={() =>
																	confirmDeleteFile(file.key, file.name)
																}
															>
																Delete
															</DropdownMenu.Item>
														</DropdownMenu.Box>
													</DropdownMenu.Content>
												</DropdownMenu>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='grid grid-cols-5 p-2 gap-2'>
								{list.folders.map(folder => (
									<ContextMenu key={folder.prefix}>
										<ContextMenu.Trigger>
											<button
												onClick={() => openFolder(folder.prefix)}
												disabled={pending}
												type='button'
												className={twMerge(
													'group flex flex-col rounded-md cursor-pointer',
													'transition-colors hover:bg-surface focus-visible:bg-surface focus-ring-base focus-ring-visible',
													selectedIds.includes(folder.prefix) && 'bg-surface',
												)}
											>
												<div className='flex flex-col items-center p-2 gap-2'>
													<PreviewCard
														className='w-16'
														placeholder={
															<Icon28FolderOutline width={28} height={28} />
														}
														ratio='square'
														radius='full'
														sizes='(max-width: 1240px) 100vw, 1240px'
														interactive={false}
													/>

													<div className='max-w-full text-center text-sm font-medium font-condensed tracking-tight'>
														<MiddleTruncate value={folder.name} />
													</div>
												</div>
											</button>
										</ContextMenu.Trigger>

										<ContextMenu.Content className='w-32'>
											<ContextMenu.Box>
												<ContextMenu.Item
													aria-label='Open folder'
													prefix={
														<Icon28FolderOutline width={18} height={18} />
													}
													onClick={() => openFolder(folder.prefix)}
												>
													Open
												</ContextMenu.Item>

												<ContextMenu.Item
													aria-label='Delete folder'
													appearance='danger'
													prefix={
														<Icon28DeleteOutline width={18} height={18} />
													}
													onClick={() =>
														confirmDeleteFolder(folder.prefix, folder.name)
													}
												>
													Delete
												</ContextMenu.Item>
											</ContextMenu.Box>
										</ContextMenu.Content>
									</ContextMenu>
								))}

								{list.files.map(file => (
									<ContextMenu key={file.key}>
										<ContextMenu.Trigger>
											<a
												key={file.key}
												href={file.url}
												target='_blank'
												rel='noreferrer'
												className={twMerge(
													'root group flex flex-col rounded-md cursor-pointer',
													'transition-colors hover:bg-surface focus-visible:bg-surface focus-ring-base focus-ring-visible',
													selectedIds.includes(file.key) && 'bg-surface',
												)}
											>
												<div className='flex flex-col items-center p-2 gap-2'>
													<PreviewCard
														className='w-16'
														ratio='square'
														src={file.url}
														alt={file.name}
														radius='sm'
														sizes='(max-width: 1240px) 100vw, 1240px'
														interactive={false}
													/>

													<div className='max-w-full text-center text-sm font-medium font-condensed tracking-tight'>
														<MiddleTruncate value={file.name} />
													</div>
												</div>
											</a>
										</ContextMenu.Trigger>

										<ContextMenu.Content className='w-32'>
											<ContextMenu.Box>
												<ContextMenu.Item
													aria-label='Open file'
													href={file.url}
													target='_blank'
													prefix={<Icon28ViewOutline width={18} height={18} />}
												>
													Open
												</ContextMenu.Item>

												<ContextMenu.Item
													aria-label='Copy CDN URL'
													prefix={<Icon28CopyOutline width={18} height={18} />}
													onClick={() => copyUrl(file.url)}
												>
													Copy URL
												</ContextMenu.Item>

												<ContextMenu.Item
													aria-label='Rename file'
													prefix={<Icon28EditOutline width={18} height={18} />}
													onClick={() => openRenameFile(file.key, file.name)}
												>
													Rename
												</ContextMenu.Item>

												<ContextMenu.Item
													aria-label='Delete file'
													appearance='danger'
													prefix={
														<Icon28DeleteOutline width={18} height={18} />
													}
													onClick={() => confirmDeleteFile(file.key, file.name)}
												>
													Delete
												</ContextMenu.Item>
											</ContextMenu.Box>
										</ContextMenu.Content>
									</ContextMenu>
								))}
							</div>
						)}

						{/* <FormItem id='article-cover-upload' className='absolute inset-2'>
							<FormItem.DropZone
								// value={file}
								// onValueChange={setFile}
								emptyTitle='Click to upload or drag and drop'
								emptyHint='PNG, JPG or GIF up to 10MB'
								className='h-full'
							/>
						</FormItem> */}
					</div>
				</div>

				{/* не трогаем этот блок */}

				{false && (
					<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
						<nav className='flex flex-wrap items-center gap-1 text-sm text-foreground-secondary'>
							<button
								type='button'
								className='hover:text-foreground transition-colors'
								onClick={() => openFolder('')}
								disabled={pending}
							>
								Root
							</button>

							{crumbs.map(crumb => (
								<span key={crumb.prefix} className='flex items-center gap-1'>
									<span className='select-none'>/</span>

									<button
										type='button'
										className='hover:text-foreground transition-colors'
										onClick={() => openFolder(crumb.prefix)}
										disabled={pending}
									>
										{crumb.label}
									</button>
								</span>
							))}
						</nav>

						{isEmpty ? (
							<div className='flex flex-col items-center justify-center gap-3 py-16 text-center border border-dashed border-separator rounded-surface'>
								<Icon28FolderOutline width={28} height={28} />

								<p className='text-foreground-secondary'>
									This folder is empty
								</p>
							</div>
						) : (
							<ul className='flex flex-col gap-2'>
								{list.folders.map(folder => (
									<li
										key={folder.prefix}
										className='flex items-center gap-3 p-3 border border-separator rounded-surface bg-surface'
									>
										<button
											type='button'
											className='flex flex-1 items-center gap-3 min-w-0 text-left'
											onClick={() => openFolder(folder.prefix)}
											disabled={pending}
										>
											<span className='flex size-10 items-center justify-center rounded-full bg-background border border-separator shrink-0'>
												<Icon28FolderOutline width={18} height={18} />
											</span>

											<span className='flex flex-col min-w-0'>
												<MiddleTruncate
													className='font-medium'
													value={folder.name}
												/>

												<span className='text-xs text-foreground-secondary'>
													Folder
												</span>
											</span>
										</button>

										<DropdownMenu>
											<DropdownMenu.Trigger>
												<Button
													mode='ghost'
													appearance='neutral'
													prefix={
														<Icon28MoreHorizontal width={18} height={18} />
													}
													iconOnly
													disabled={pending}
												/>
											</DropdownMenu.Trigger>

											<DropdownMenu.Content className='w-36'>
												<DropdownMenu.Box>
													<DropdownMenu.Item
														appearance='danger'
														prefix={
															<Icon28DeleteOutline width={18} height={18} />
														}
														onClick={() =>
															confirmDeleteFolder(folder.prefix, folder.name)
														}
													>
														Delete
													</DropdownMenu.Item>
												</DropdownMenu.Box>
											</DropdownMenu.Content>
										</DropdownMenu>
									</li>
								))}

								{list.files.map(file => (
									<li
										key={file.key}
										className='flex items-center gap-3 p-3 border border-separator rounded-surface bg-surface'
									>
										<a
											href={file.url}
											target='_blank'
											rel='noreferrer'
											className='root flex flex-1 items-center gap-3 min-w-0'
										>
											<span className='flex size-10 items-center justify-center rounded-full bg-background border border-separator shrink-0 overflow-hidden'>
												{/\.(png|jpe?g|gif|webp|svg)$/i.test(file.name) ? (
													<Image
														src={file.url}
														alt=''
														width={40}
														height={40}
														className='size-full object-cover'
													/>
												) : (
													<Icon28PictureOutline width={18} height={18} />
												)}
											</span>

											<span className='flex flex-col min-w-0 gap-1'>
												<MiddleTruncate
													className='font-medium'
													value={file.name}
												/>

												<span className='flex flex-wrap gap-1.5'>
													<Badge size='md' mode='soft' appearance='neutral'>
														{formatBytes(file.size)}
													</Badge>

													{file.lastModified && (
														<Badge size='md' mode='soft' appearance='neutral'>
															{getFormattedDate(file.lastModified, false).short}
														</Badge>
													)}
												</span>
											</span>
										</a>

										<DropdownMenu>
											<DropdownMenu.Trigger>
												<Button
													mode='ghost'
													appearance='neutral'
													prefix={
														<Icon28MoreHorizontal width={18} height={18} />
													}
													iconOnly
													disabled={pending}
												/>
											</DropdownMenu.Trigger>

											<DropdownMenu.Content className='w-40'>
												<DropdownMenu.Box>
													<DropdownMenu.Item
														prefix={
															<Icon28CopyOutline width={18} height={18} />
														}
														onClick={() => copyUrl(file.url)}
													>
														Copy URL
													</DropdownMenu.Item>

													<DropdownMenu.Item
														appearance='danger'
														prefix={
															<Icon28DeleteOutline width={18} height={18} />
														}
														onClick={() =>
															confirmDeleteFile(file.key, file.name)
														}
													>
														Delete
													</DropdownMenu.Item>
												</DropdownMenu.Box>
											</DropdownMenu.Content>
										</DropdownMenu>
									</li>
								))}
							</ul>
						)}

						{list.isTruncated && (
							<p className='text-sm text-foreground-secondary'>
								Showing first page of results. Narrow into folders if the list
								is truncated.
							</p>
						)}
					</section>
				)}
			</section>
		</>
	)
}
