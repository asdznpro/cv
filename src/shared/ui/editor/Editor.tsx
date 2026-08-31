'use client'

import {
	BlockquoteRules,
	BoldRules,
	CodeRules,
	HeadingRules,
	HorizontalRuleRules,
	ItalicRules,
} from '@platejs/basic-nodes'
import {
	BlockquotePlugin,
	BoldPlugin,
	CodePlugin,
	H1Plugin,
	H2Plugin,
	HorizontalRulePlugin,
	ItalicPlugin,
	UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { MarkdownPlugin } from '@platejs/markdown'
import {
	Plate,
	PlateContent,
	useEditorRef,
	useEditorSelector,
	usePlateEditor,
} from 'platejs/react'
import remarkGfm from 'remark-gfm'
import { twMerge } from 'tailwind-merge'

import { Button, Separator } from 'ui/blocks'
import { DropdownMenu } from 'ui/floating'

import {
	Icon24AddOutline,
	Icon24ArrowUturnLeftOutline,
	Icon24ArrowUturnRightOutline,
	Icon24BracketsSlashOutline,
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

import type { EditorProps } from './Editor.interface'
import { BlockquoteElement } from './nodes/BlockquoteElement'
import { H1Element, H2Element } from './nodes/HeadingElement'
import { HrElement } from './nodes/HrElement'

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

const defaultMarkdown = `## Heading 2

> This is a quote.

With some **bold** text for emphasis!
`

export function Editor({
	content = defaultMarkdown,
	editable = true,
	className,
	onUpdate,
}: EditorProps) {
	const editor = usePlateEditor({
		plugins: [
			BoldPlugin.configure({
				inputRules: [
					BoldRules.markdown({ variant: '*' }),
					BoldRules.markdown({ variant: '_' }),
				],
			}),
			ItalicPlugin.configure({
				inputRules: [
					ItalicRules.markdown({ variant: '*' }),
					ItalicRules.markdown({ variant: '_' }),
				],
			}),
			UnderlinePlugin,
			CodePlugin.configure({
				inputRules: [CodeRules.markdown()],
			}),
			H1Plugin.configure({
				inputRules: [HeadingRules.markdown()],
			}).withComponent(H1Element),
			H2Plugin.configure({
				inputRules: [HeadingRules.markdown()],
			}).withComponent(H2Element),
			BlockquotePlugin.configure({
				inputRules: [BlockquoteRules.markdown()],
			}).withComponent(BlockquoteElement),
			HorizontalRulePlugin.configure({
				inputRules: [
					HorizontalRuleRules.markdown({ variant: '-' }),
					HorizontalRuleRules.markdown({ variant: '_' }),
				],
			}).withComponent(HrElement),
			MarkdownPlugin.configure({
				options: {
					remarkPlugins: [remarkGfm],
				},
			}),
		],
		value: editor =>
			editor.getApi(MarkdownPlugin).markdown.deserialize(content),
	})

	return (
		<Plate
			editor={editor}
			onChange={() => {
				onUpdate?.(editor.api.markdown.serialize())
			}}
		>
			<div className='flex flex-wrap p-1.5 gap-1.5 rounded-full bg-surface-secondary'>
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
								onClick={() => editor.tf.blockquote.toggle()}
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
								prefix={
									<Icon24Squareshape4GridOutline width={18} height={18} />
								}
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
								prefix={<Icon24ListBulletOutline width={18} height={18} />}
							>
								Bulleted list
							</DropdownMenu.Item>

							<DropdownMenu.Item
								prefix={<Icon24ListNumberOutline width={18} height={18} />}
							>
								Numbered list
							</DropdownMenu.Item>

							<DropdownMenu.Item
								prefix={<Icon24ListCheckOutline width={18} height={18} />}
							>
								To-do list
							</DropdownMenu.Item>
						</DropdownMenu.Box>

						<DropdownMenu.Box>
							<DropdownMenu.Heading>Inline</DropdownMenu.Heading>

							<DropdownMenu.Item
								prefix={<Icon24Linked width={18} height={18} />}
							>
								Link
							</DropdownMenu.Item>
						</DropdownMenu.Box>
					</DropdownMenu.Content>
				</DropdownMenu>

				<Button
					onClick={() => editor.tf.h1.toggle()}
					size='sm'
					mode='ghost'
					appearance='neutral'
					prefix={<Icon24TextHeading1Outline width={16} height={16} />}
					radius='rounded'
					iconOnly
				/>
				<Button
					onClick={() => editor.tf.h2.toggle()}
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
					onClick={() => editor.tf.blockquote.toggle()}
					prefix={<Icon24QuoteClosing width={16} height={16} />}
					radius='rounded'
					iconOnly
				/>

				<Separator className='h-1/2 my-auto' orientation='vertical' />

				<Button
					size='sm'
					mode='ghost'
					appearance='neutral'
					onClick={() => editor.tf.bold.toggle()}
					prefix={<span className='font-bold'>B</span>}
					radius='rounded'
					iconOnly
				/>
				<Button
					size='sm'
					mode='ghost'
					appearance='neutral'
					onClick={() => editor.tf.italic.toggle()}
					prefix={<span className='italic'>I</span>}
					radius='rounded'
					iconOnly
				/>
				<Button
					size='sm'
					mode='ghost'
					appearance='neutral'
					onClick={() => editor.tf.underline.toggle()}
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

				<Button
					size='sm'
					mode='ghost'
					appearance='neutral'
					prefix={<Icon24ListBulletOutline width={16} height={16} />}
					radius='rounded'
					iconOnly
				/>
				<Button
					size='sm'
					mode='ghost'
					appearance='neutral'
					prefix={<Icon24ListNumberOutline width={16} height={16} />}
					radius='rounded'
					iconOnly
				/>
				<Button
					size='sm'
					mode='ghost'
					appearance='neutral'
					prefix={<Icon24ListCheckOutline width={16} height={16} />}
					radius='rounded'
					iconOnly
				/>

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

			<PlateContent
				disabled={!editable}
				disableDefaultStyles
				placeholder='Type here...'
				className={twMerge(
					'root w-full flex flex-col gap-app outline-none whitespace-pre-wrap wrap-break-word',
					className,
				)}
			/>
		</Plate>
	)
}
