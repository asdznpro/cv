export interface ArticleCopyMenuProps {
	/** Raw markdown source to copy. */
	markdown: string
	/** Absolute or site URL; defaults to `window.location.href`. */
	url?: string
	className?: string
}
