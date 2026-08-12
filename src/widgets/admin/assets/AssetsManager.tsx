'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { toast } from 'sonner'

import {
	breadcrumbSegments,
	createFolderAction,
	deleteAssetsAction,
	deleteFolderAction,
	hrefForAssetsPrefix,
	parentPrefix,
	uploadAssetAction,
	type AssetListResult,
} from 'lib/r2'
import { getFormattedDate } from 'lib/utils'

import { Badge, Button } from 'ui/blocks'
import { DropdownMenu } from 'ui/floating'
import { useOverlay } from 'ui/overlays'

import {
	Icon28AddOutline,
	Icon28ArrowUpOutline,
	Icon28CopyOutline,
	Icon28DeleteOutline,
	Icon28FolderOutline,
	Icon28MoreHorizontal,
	Icon28PictureOutline,
	Icon28UploadOutline,
} from '@vkontakte/icons'

import { CreateFolderDialog } from './CreateFolderDialog'
import { DeleteAssetDialog } from './DeleteAssetDialog'

function formatBytes(size: number) {
	if (size < 1024) return `${size} B`
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
	return `${(size / (1024 * 1024)).toFixed(1)} MB`
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

	useEffect(() => {
		setList(initial)
	}, [initial])

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

						<p className='text-foreground-secondary'>This folder is empty</p>
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
										<span className='font-medium truncate'>{folder.name}</span>

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
											prefix={<Icon28MoreHorizontal width={18} height={18} />}
											iconOnly
											disabled={pending}
										/>
									</DropdownMenu.Trigger>

									<DropdownMenu.Content className='w-36'>
										<DropdownMenu.Box>
											<DropdownMenu.Item
												appearance='danger'
												prefix={<Icon28DeleteOutline width={18} height={18} />}
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
										<span className='font-medium truncate'>{file.name}</span>

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
											prefix={<Icon28MoreHorizontal width={18} height={18} />}
											iconOnly
											disabled={pending}
										/>
									</DropdownMenu.Trigger>

									<DropdownMenu.Content className='w-40'>
										<DropdownMenu.Box>
											<DropdownMenu.Item
												prefix={<Icon28CopyOutline width={18} height={18} />}
												onClick={() => copyUrl(file.url)}
											>
												Copy URL
											</DropdownMenu.Item>

											<DropdownMenu.Item
												appearance='danger'
												prefix={<Icon28DeleteOutline width={18} height={18} />}
												onClick={() => confirmDeleteFile(file.key, file.name)}
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
						Showing first page of results. Narrow into folders if the list is
						truncated.
					</p>
				)}
			</section>
		</>
	)
}
