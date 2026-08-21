'use client'

import { useState } from 'react'

import { toast } from 'sonner'
import { useClipboard, useHotkeys } from '@siberiacancode/reactuse'

import {
	Button,
	Kbd,
	ScrollArea,
	Separator,
	Tabs,
	useTabState,
} from 'ui/blocks'
import { MarkdownPreview } from 'ui/markdown'

import { Icon28DocumentTextOutline } from '@vkontakte/icons'

function getCursorPosition(value: string, selectionStart: number) {
	const textBefore = value.slice(0, Math.max(0, selectionStart))
	const lines = textBefore.split('\n')
	return {
		line: lines.length,
		column: (lines.at(-1)?.length ?? 0) + 1,
	}
}

type ArticleMarkdownEditorProps = {
	value: string
	onValueChange: (value: string) => void
}

export function ArticleMarkdownEditor({
	value,
	onValueChange,
}: ArticleMarkdownEditorProps) {
	const { copy } = useClipboard()
	const { tabState, handleTabSelect } = useTabState(0)
	const [cursor, setCursor] = useState({ line: 1, column: 1 })

	const contentStats = {
		chars: value.length,
		lines: value.length === 0 ? 0 : value.split('\n').length,
	}

	function syncCursor(textarea: HTMLTextAreaElement) {
		setCursor(getCursorPosition(textarea.value, textarea.selectionStart))
	}

	function toggleMode() {
		handleTabSelect(tabState === 0 ? 1 : 0)
	}

	useHotkeys('ctrl+enter, meta+enter', event => {
		event.preventDefault()
		toggleMode()
	})

	return (
		<>
			<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
				<div className='flex flex-col gap-3'>
					<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
						Content
					</h2>
				</div>
			</div>

			<div className='flex flex-col border border-separator rounded-surface overflow-hidden'>
				<div className='flex flex-col bg-surface'>
					<div className='h-12 flex items-center px-surface gap-surface'>
						<Tabs
							className='border-none'
							initialIndex={tabState}
							onTabSelect={handleTabSelect}
						>
							<Tabs.Item>Edit</Tabs.Item>
							<Tabs.Item>Preview</Tabs.Item>
						</Tabs>

						<Button
							type='button'
							size='sm'
							mode='soft'
							appearance='neutral'
							prefix={<Icon28DocumentTextOutline width={16} height={16} />}
							onClick={() => {
								void copy(value)
								toast.success('Markdown copied')
							}}
						>
							Copy Markdown
						</Button>
					</div>
				</div>

				<Separator />

				{tabState === 0 ? (
					<div className='flex'>
						<textarea
							className='w-full p-surface resize-none appearance-none outline-none text-xs font-mono placeholder:text-foreground-secondary disabled:placeholder:text-foreground-tertiary'
							placeholder='Write your article here...'
							rows={20}
							value={value}
							onChange={event => {
								onValueChange(event.currentTarget.value)
								syncCursor(event.currentTarget)
							}}
							onClick={event => syncCursor(event.currentTarget)}
							onKeyUp={event => syncCursor(event.currentTarget)}
							onSelect={event => syncCursor(event.currentTarget)}
						/>
					</div>
				) : (
					<ScrollArea className='max-h-88'>
						<div className='flex p-surface'>
							<MarkdownPreview>{value}</MarkdownPreview>
						</div>
					</ScrollArea>
				)}

				<Separator />

				<div className='h-12 flex items-center p-surface gap-surface bg-surface'>
					{tabState === 0 && (
						<>
							<span className='text-xs text-foreground-secondary'>
								Line {cursor.line}, Column {cursor.column}
							</span>

							<Separator orientation='vertical' />
						</>
					)}

					<span className='text-xs text-foreground-secondary'>
						{contentStats.lines} lines
					</span>

					<Separator orientation='vertical' />

					<span className='text-xs text-foreground-secondary'>
						{contentStats.chars.toLocaleString('ru-RU')} characters
					</span>

					<span className='flex-1' />

					<span className='flex items-center gap-2'>
						<Kbd size='sm' keys={['Ctrl', 'Enter']} />
						<span className='text-xs text-foreground-secondary'>
							switch mode
						</span>
					</span>
				</div>
			</div>
		</>
	)
}
