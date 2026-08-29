import type { ButtonProps } from '../button'

export interface CopyButtonProps
	extends Omit<
		ButtonProps,
		'appearance' | 'prefix' | 'href' | 'to' | 'as' | 'value'
	> {
	value: string | (() => string)
	timeout?: number
	copiedChildren?: React.ReactNode
	onCopied?: (value: string) => void
}
