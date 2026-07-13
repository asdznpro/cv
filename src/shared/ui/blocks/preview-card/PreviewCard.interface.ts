export interface PreviewCardProps extends Omit<
	React.AllHTMLAttributes<HTMLElement>,
	'size'
> {
	ratio?:
		| '5:2'
		| '2:1'
		| 'video'
		| '3:2'
		| '4:3'
		| '5:4'
		| 'square'
		| '4:5'
		| '3:4'
		| '2:3'
		| 'story'
		| '1:2'
		| '2:5'
		| 'auto'
		| undefined

	priority?: boolean
}
