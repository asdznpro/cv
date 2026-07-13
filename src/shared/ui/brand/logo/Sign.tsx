import type LogoProps from './Logo.interface'

export function Sign(props: LogoProps) {
	const { width, height, className } = props

	const computedStyle = {
		width: width ? width : 84,
		height: height ? height : 100,
	}

	return (
		<svg
			style={computedStyle}
			className={className}
			width='84'
			height='100'
			viewBox='0 0 84 100'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g clipPath='url(#clip0_1440_2715-zjhfqm)'>
				<path
					d='M75.4444 100H73.7778V94.5806H72V93H79.5556L80.5556 96.3871H80.6667L81.6667 93H84V100H82.3333V96.8387L82.6667 94.8065H82.3333L81 99.0968H80.2222L78.8889 94.8065H78.5556L78.8889 96.8387V100H77.2222V94.5806H75.4444V100Z'
					fill='var(--color-accent)'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M34.2141 0L43.791 35L49.8318 57.0757L51.6868 65.6758L55.3525 65.4053L50.1931 41.7568V0H65.8069V41.7568L60.5117 65.4053L64.3132 65.6758L69.4727 41.7568L69.8799 35H84L66.2141 100H49.7859L40.209 65L34.1682 42.9243L32.3132 34.3242L28.6475 34.5947L33.8069 58.2432V100H18.1931V58.2432L23.4883 34.5947L19.6868 34.3242L14.5273 58.2432L14.1201 65H0L17.7859 0H34.2141Z'
					fill='var(--color-accent)'
				/>
			</g>
			<defs>
				<clipPath id='clip0_1440_2715-zjhfqm'>
					<rect width='84' height='100' fill='white' />
				</clipPath>
			</defs>
		</svg>
	)
}
