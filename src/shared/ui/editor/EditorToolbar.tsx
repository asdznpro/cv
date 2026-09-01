'use client'

import { ListPlugin } from '@platejs/list-classic/react'
import { KEYS } from 'platejs'
import { useEditorRef, useEditorSelector } from 'platejs/react'

import { Button, Separator } from 'ui/blocks'
import { DropdownMenu } from 'ui/floating'

import {
	Icon24AddOutline,
	Icon24ArrowUturnLeftOutline,
	Icon24ArrowUturnRightOutline,
	Icon24BracketsSlashOutline,
	Icon24ChevronDown,
	Icon24Linked,
	Icon24ListBulletOutline,
	Icon24ListCheckOutline,
	Icon24ListNumberOutline,
	Icon24MinusOutline,
	Icon24QuoteClosing,
	Icon24Squareshape4GridOutline,
	Icon24TextHeading1Outline,
	Icon24TextHeading2Outline,
	Icon24TextTtOutline,
	Icon28MoreHorizontal,
} from '@vkontakte/icons'

function HistoryButtons() {
	const editor = useEditorRef()

	const canUndo = useEditorSelector(
		current => current.history.undos.length > 0,
		[],
	)
	const canRedo = useEditorSelector(
		current => current.history.redos.length > 0,
		[],
	)

	return (
		<>
			<Button
				type='button'
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon24ArrowUturnLeftOutline width={16} height={16} />}
				radius='rounded'
				iconOnly
				disabled={!canUndo}
				aria-label='Undo'
				onClick={() => editor.undo()}
			/>
			<Button
				type='button'
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon24ArrowUturnRightOutline width={16} height={16} />}
				radius='rounded'
				iconOnly
				disabled={!canRedo}
				aria-label='Redo'
				onClick={() => editor.redo()}
			/>
		</>
	)
}

export function EditorToolbar() {
	const editor = useEditorRef()

	const toggleList = (
		type: typeof KEYS.ulClassic | typeof KEYS.olClassic | typeof KEYS.taskList,
	) => {
		if (type === KEYS.taskList) {
			editor.getTransforms(ListPlugin).toggle.taskList()
			return
		}

		editor.getTransforms(ListPlugin).toggle.list({ type })
	}

	return (
		<div className='mb-6 z-10 flex flex-wrap p-1.5 gap-1.5 rounded-full bg-surface-secondary'>
			<HistoryButtons />

			<Separator className='h-1/2 my-auto' orientation='vertical' />

			<DropdownMenu align='start'>
				<DropdownMenu.Trigger>
					<Button
						type='button'
						size='sm'
						mode='ghost'
						appearance='neutral'
						prefix={<Icon24AddOutline width={16} height={16} />}
						radius='rounded'
						iconOnly
					/>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content className='w-40'>
					<DropdownMenu.Box>
						<DropdownMenu.Heading>Basic blocks</DropdownMenu.Heading>

						<DropdownMenu.Item
							prefix={<Icon24TextHeading1Outline width={18} height={18} />}
						>
							Heading 1
						</DropdownMenu.Item>

						<DropdownMenu.Item
							prefix={<Icon24TextHeading2Outline width={18} height={18} />}
						>
							Heading 2
						</DropdownMenu.Item>

						<DropdownMenu.Item
							prefix={<Icon24TextTtOutline width={18} height={18} />}
						>
							Paragraph
						</DropdownMenu.Item>

						<DropdownMenu.Item
							onClick={() => editor.tf.toggleBlock(KEYS.blockquote)}
							prefix={<Icon24QuoteClosing width={18} height={18} />}
						>
							Quote
						</DropdownMenu.Item>

						<DropdownMenu.Item
							prefix={<Icon24MinusOutline width={18} height={18} />}
						>
							Separator
						</DropdownMenu.Item>

						<DropdownMenu.Item
							prefix={<Icon24Squareshape4GridOutline width={18} height={18} />}
						>
							Table
						</DropdownMenu.Item>

						<DropdownMenu.Item
							prefix={<Icon24BracketsSlashOutline width={18} height={18} />}
						>
							Code
						</DropdownMenu.Item>
					</DropdownMenu.Box>

					<DropdownMenu.Box>
						<DropdownMenu.Heading>Lists</DropdownMenu.Heading>

						<DropdownMenu.Item
							onClick={() => toggleList(KEYS.ulClassic)}
							prefix={<Icon24ListBulletOutline width={18} height={18} />}
						>
							Bulleted
						</DropdownMenu.Item>

						<DropdownMenu.Item
							onClick={() => toggleList(KEYS.olClassic)}
							prefix={<Icon24ListNumberOutline width={18} height={18} />}
						>
							Numbered
						</DropdownMenu.Item>

						<DropdownMenu.Item
							onClick={() => toggleList(KEYS.taskList)}
							prefix={<Icon24ListCheckOutline width={18} height={18} />}
						>
							To-do
						</DropdownMenu.Item>
					</DropdownMenu.Box>

					<DropdownMenu.Box>
						<DropdownMenu.Heading>Inline</DropdownMenu.Heading>

						<DropdownMenu.Item prefix={<Icon24Linked width={18} height={18} />}>
							Link
						</DropdownMenu.Item>
					</DropdownMenu.Box>
				</DropdownMenu.Content>
			</DropdownMenu>

			<Button
				onClick={() => editor.tf.toggleBlock(KEYS.h1)}
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon24TextHeading1Outline width={16} height={16} />}
				radius='rounded'
				iconOnly
			/>
			<Button
				onClick={() => editor.tf.toggleBlock(KEYS.h2)}
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon24TextHeading2Outline width={16} height={16} />}
				radius='rounded'
				iconOnly
			/>

			<Button
				size='sm'
				mode='ghost'
				appearance='neutral'
				onClick={() => editor.tf.toggleBlock(KEYS.blockquote)}
				prefix={<Icon24QuoteClosing width={16} height={16} />}
				radius='rounded'
				iconOnly
			/>

			<Separator className='h-1/2 my-auto' orientation='vertical' />

			<Button
				size='sm'
				mode='ghost'
				appearance='neutral'
				onClick={() => editor.tf.toggleMark(KEYS.bold)}
				prefix={<span className='font-bold'>B</span>}
				radius='rounded'
				iconOnly
			/>
			<Button
				size='sm'
				mode='ghost'
				appearance='neutral'
				onClick={() => editor.tf.toggleMark(KEYS.italic)}
				prefix={<span className='italic'>I</span>}
				radius='rounded'
				iconOnly
			/>
			<Button
				size='sm'
				mode='ghost'
				appearance='neutral'
				onClick={() => editor.tf.toggleMark(KEYS.underline)}
				prefix={<span className='underline'>U</span>}
				radius='rounded'
				iconOnly
			/>
			<Button
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<span className='line-through'>S</span>}
				radius='rounded'
				iconOnly
			/>
			<Button
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon24BracketsSlashOutline width={16} height={16} />}
				radius='rounded'
				iconOnly
			/>

			<Separator className='h-1/2 my-auto' orientation='vertical' />

			<DropdownMenu align='start'>
				<DropdownMenu.Trigger>
					<Button
						size='sm'
						mode='ghost'
						appearance='neutral'
						prefix={<Icon24ListBulletOutline width={16} height={16} />}
						suffix={<Icon24ChevronDown width={16} height={16} />}
						radius='rounded'
						iconOnly
					/>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content className='w-40'>
					<DropdownMenu.Box>
						<DropdownMenu.Heading>Lists</DropdownMenu.Heading>

						<DropdownMenu.Item
							onClick={() => toggleList(KEYS.ulClassic)}
							prefix={<Icon24ListBulletOutline width={18} height={18} />}
						>
							Bulleted
						</DropdownMenu.Item>

						<DropdownMenu.Item
							onClick={() => toggleList(KEYS.olClassic)}
							prefix={<Icon24ListNumberOutline width={18} height={18} />}
						>
							Numbered
						</DropdownMenu.Item>

						<DropdownMenu.Item
							onClick={() => toggleList(KEYS.taskList)}
							prefix={<Icon24ListCheckOutline width={18} height={18} />}
						>
							To-do
						</DropdownMenu.Item>
					</DropdownMenu.Box>
				</DropdownMenu.Content>
			</DropdownMenu>

			<Separator className='h-1/2 my-auto' orientation='vertical' />

			<Button
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon24Linked width={16} height={16} />}
				radius='rounded'
				iconOnly
			/>
			<Button
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon24Squareshape4GridOutline width={16} height={16} />}
				suffix={<Icon24ChevronDown width={16} height={16} />}
				radius='rounded'
				iconOnly
			/>

			<Button
				className='ml-auto'
				size='sm'
				mode='ghost'
				appearance='neutral'
				prefix={<Icon28MoreHorizontal width={16} height={16} />}
				radius='rounded'
				iconOnly
			/>
		</div>
	)
}
