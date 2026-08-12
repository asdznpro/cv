'use client'

import { Badge } from 'ui/blocks'
import { DropdownMenu } from 'ui/floating'

import {
	Icon28ChainOutline,
	Icon28ChevronDownOutline,
	Icon28DocumentTextOutline,
} from '@vkontakte/icons'

import type { ArticleCopyMenuProps } from './ArticleCopyMenu.interface'

async function copyText(value: string) {
	await navigator.clipboard.writeText(value)
}

export function ArticleCopyMenu({
	markdown,
	url,
	className,
}: ArticleCopyMenuProps) {
	return (
		<DropdownMenu align='center'>
			<DropdownMenu.Trigger className={className}>
				<Badge
					mode='outline'
					appearance='neutral'
					suffix={<Icon28ChevronDownOutline width={16} height={16} />}
				>
					Copy
				</Badge>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content className='w-44'>
				<DropdownMenu.Box>
					<DropdownMenu.Item
						aria-label='Copy URL'
						prefix={<Icon28ChainOutline width={18} height={18} />}
						onClick={() => copyText(url ?? window.location.href)}
					>
						Copy URL
					</DropdownMenu.Item>

					<DropdownMenu.Item
						aria-label='Copy Markdown'
						prefix={<Icon28DocumentTextOutline width={18} height={18} />}
						onClick={() => copyText(markdown)}
					>
						Copy Markdown
					</DropdownMenu.Item>
				</DropdownMenu.Box>
			</DropdownMenu.Content>
		</DropdownMenu>
	)
}
