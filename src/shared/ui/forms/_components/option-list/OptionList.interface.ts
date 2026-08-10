export type FieldOption = {
	value: string
	label: string
	disabled?: boolean
}

export type OptionListProps = {
	options: FieldOption[]
	value?: string | string[]
	activeIndex: number | null
	listRef: React.RefObject<Array<HTMLElement | null>>
	getItemProps: (
		userProps?: React.HTMLAttributes<HTMLElement> &
			React.ButtonHTMLAttributes<HTMLElement>,
	) => Record<string, unknown>
	onSelect: (value: string) => void
	mode?: 'secondary' | 'outline'
	radius?: 'smooth' | 'rounded' | 'none'
	emptyText?: string
	style?: React.CSSProperties
	className?: string
}
