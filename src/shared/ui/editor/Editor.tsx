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
import { DndPlugin } from '@platejs/dnd'
import { MarkdownPlugin } from '@platejs/markdown'
import { Plate, PlateContent, usePlateEditor } from 'platejs/react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import remarkGfm from 'remark-gfm'
import { twMerge } from 'tailwind-merge'

import { BlockDraggable } from './BlockDraggable'
import type { EditorProps } from './Editor.interface'
import { EditorToolbar } from './EditorToolbar'
import { BlockquoteElement } from './nodes/BlockquoteElement'
import { H1Element, H2Element } from './nodes/HeadingElement'
import { HrElement } from './nodes/HrElement'

const defaultMarkdown = `# Notes from the last sprint

A scratch pad for the editor playground. Drag blocks around, toggle marks, and see how headings sit against body copy.

## Why this draft exists

The public site still renders Markdown through rehype. This editor is the other tree: same source string, different document model. The point of a longer fixture is to have something to scroll, select, and reorder.

Plate treats each block as a node. A wrapped paragraph is still one block. A heading is one block. That is why the drag handle sits on the left of the whole unit, not on every visual line.

> Write for the reader who opens this cold on Monday. If a sentence only makes sense with the Slack thread next to it, it is not done.

Inline marks should survive a round trip: **bold**, *italic*, \`code\`, and a mix of **bold and *italic***. Underline is a mark in the editor, not in CommonMark, so it may drop on serialize.

## What to try

Select a heading and convert it back to a paragraph. Empty a paragraph and leave the caret there. Undo should restore both the text and the block type.

---

The quote below is a blockquote, not a pull quote. Variant metadata from the article pipeline is a different node and is not wired here yet.

> Ship the smallest change that makes the next edit obvious.

## A longer passage

Most of the time the work is not choosing a stack. It is keeping the published article and the admin editor honest with each other. Custom blocks stay presentational. Rehype maps HAST. The editor maps Slate. If those adapters drift, the page looks right and the editor looks empty, or the other way around.

When a paragraph feels too long, split it. When two paragraphs are the same thought, join them. The toolbar is for the cases where the keyboard shortcut is not in your hands yet.

Leave this last line for a new paragraph.
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
			DndPlugin.configure({
				render: {
					aboveNodes: BlockDraggable,
					aboveSlate: ({ children }) => (
						<DndProvider backend={HTML5Backend}>{children}</DndProvider>
					),
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
			<EditorToolbar />

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
