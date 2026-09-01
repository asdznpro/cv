import type { List as MdList, ListItem as MdListItem, RootContent } from 'mdast'
import {
	convertChildrenDeserialize,
	convertNodesSerialize,
	type DeserializeMdOptions,
	type MdDecoration,
	type MdRules,
	type SerializeMdOptions,
} from '@platejs/markdown'
import { KEYS, type Descendant } from 'platejs'

function isChecked(value: unknown): value is boolean {
	return value === true || value === false
}

function deserializeListItemChildren(
	mdastChildren: MdListItem['children'],
	deco: MdDecoration,
	options: DeserializeMdOptions,
): Descendant[] {
	const editor = options.editor
	if (!editor) return [{ text: '' }]

	const licType = editor.getType(KEYS.lic)
	const children = mdastChildren
		.map(child => {
			if (child.type === 'paragraph') {
				const inlines = convertChildrenDeserialize(
					child.children as RootContent[],
					deco,
					options,
				)

				return {
					type: licType,
					children: inlines.length > 0 ? inlines : [{ text: '' }],
				}
			}

			return convertChildrenDeserialize(
				[child as RootContent],
				deco,
				options,
			)[0]
		})
		.filter(Boolean) as Descendant[]

	if (!children.some(child => 'type' in child && child.type === licType)) {
		children.unshift({
			type: licType,
			children: [{ text: '' }],
		} as Descendant)
	}

	return children
}

function deserializeListItem(
	mdastNode: MdListItem,
	deco: MdDecoration,
	options: DeserializeMdOptions,
) {
	const editor = options.editor
	if (!editor) return { type: KEYS.li, children: [{ text: '' }] }

	const item: Record<string, unknown> = {
		type: editor.getType(KEYS.li),
		children: deserializeListItemChildren(mdastNode.children, deco, options),
	}

	if (isChecked(mdastNode.checked)) item.checked = mdastNode.checked

	return item
}

function serializeList(
	node: Record<string, unknown>,
	options: SerializeMdOptions,
): MdList {
	const editor = options.editor
	if (!editor) {
		return { type: 'list', ordered: false, spread: false, children: [] }
	}

	const liType = editor.getType(KEYS.li)
	const licType = editor.getType(KEYS.lic)
	const ulType = editor.getType(KEYS.ulClassic)
	const olType = editor.getType(KEYS.olClassic)
	const taskType = editor.getType(KEYS.taskList)

	const children = Array.isArray(node.children) ? node.children : []
	const items: MdListItem[] = []

	for (const child of children) {
		if (!child || typeof child !== 'object' || child.type !== liType) continue

		const listItem: MdListItem = {
			type: 'listItem',
			spread: false,
			checked: isChecked(child.checked) ? child.checked : null,
			children: [],
		}

		const liChildren = Array.isArray(child.children) ? child.children : []

		for (const liChild of liChildren) {
			if (!liChild || typeof liChild !== 'object') continue

			if (liChild.type === licType) {
				listItem.children.push({
					type: 'paragraph',
					children: convertNodesSerialize(
						(liChild.children ?? []) as Descendant[],
						options,
					),
				} as MdListItem['children'][number])
				continue
			}

			if (
				liChild.type === ulType ||
				liChild.type === olType ||
				liChild.type === taskType
			) {
				listItem.children.push(
					serializeList(liChild as Record<string, unknown>, options),
				)
			}
		}

		items.push(listItem)
	}

	return {
		type: 'list',
		ordered: node.type === olType,
		spread: false,
		children: items,
	}
}

export const listMarkdownRules: MdRules = {
	list: {
		deserialize: (mdastNode: MdList, deco, options) => {
			const editor = options.editor
			if (!editor) return { type: KEYS.ulClassic, children: [{ text: '' }] }

			const children = mdastNode.children.map(child => {
				if (child.type === 'listItem') {
					return deserializeListItem(child, deco, options)
				}

				return convertChildrenDeserialize(
					[child as RootContent],
					deco,
					options,
				)[0]
			})

			const isTask = children.some(
				child =>
					Boolean(child) &&
					typeof child === 'object' &&
					isChecked((child as { checked?: unknown }).checked),
			)

			return {
				type: mdastNode.ordered
					? editor.getType(KEYS.olClassic)
					: isTask
						? editor.getType(KEYS.taskList)
						: editor.getType(KEYS.ulClassic),
				children,
			}
		},
		serialize: (node, options) =>
			serializeList(node as Record<string, unknown>, options),
	},
	listItem: {
		deserialize: (mdastNode: MdListItem, deco, options) =>
			deserializeListItem(mdastNode, deco, options),
		serialize: (node, options) => ({
			type: 'listItem' as const,
			spread: false,
			checked: isChecked(node.checked) ? node.checked : null,
			children: convertNodesSerialize(
				(node.children ?? []) as Descendant[],
				options,
			),
		}),
	},
}
