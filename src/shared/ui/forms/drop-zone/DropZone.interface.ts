import type { FieldStatus } from '../field-status.type'

export default interface DropZoneProps {
	value?: File | null
	defaultValue?: File | null
	onValueChange?: (file: File | null) => void
	/** Remote / CDN preview when there is no local File yet. */
	previewSrc?: string | null
	accept?: string
	/** MIME prefixes for drag filtering, e.g. `['image']`. */
	dataTypes?: string[]
	maxSize?: number
	multiple?: boolean
	disabled?: boolean
	required?: boolean
	id?: string
	name?: string
	className?: string
	status?: FieldStatus
	emptyTitle?: string
	emptyHint?: string
	onReject?: (reason: 'type' | 'size', file: File) => void
}
