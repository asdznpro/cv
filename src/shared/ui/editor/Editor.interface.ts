export interface EditorProps {
	content?: string
	editable?: boolean
	className?: string
	onUpdate?: (markdown: string) => void
}
