export function ExpandIndicator(props: React.AllHTMLAttributes<HTMLElement>) {
	const { size, className } = props

	const computedStyle = {
		width: size ? size : 12,
		height: size ? size : 12,
	}

	return (
		<svg
			style={computedStyle}
			className={className}
			viewBox='0 0 12 12'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<rect
				x='10.9707'
				y='1.33112'
				width='0.84'
				height='12.9596'
				transform='rotate(45 10.9707 1.33112)'
				fill='currentColor'
			/>
			<rect
				x='10.8223'
				y='3.99628'
				width='0.84'
				height='8.85619'
				transform='rotate(45 10.8223 3.99628)'
				fill='currentColor'
			/>
		</svg>
	)
}
