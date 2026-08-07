export default interface TabsProps extends React.AllHTMLAttributes<HTMLElement> {
	onTabSelect?: (index: number) => void
	initialIndex?: number
	overflow?: 'hidden' | 'carousel'
	fadeSize?: number
}
