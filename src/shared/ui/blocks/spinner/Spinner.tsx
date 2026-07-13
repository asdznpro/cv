import { twMerge } from 'tailwind-merge'

import type SpinnerProps from './Spinner.interface'

import { Icon24Spinner } from '@vkontakte/icons'

const Spinner: React.FC<SpinnerProps> = props => {
	const { size, width, height, className, ...restProps } = props

	const computedStyle = {
		width: size ? size : width ? width : 28,
		height: size ? size : height ? height : 28,
	}

	return (
		<div {...restProps} className={twMerge('w-fit', className)}>
			<Icon24Spinner style={computedStyle} className='animate-spin' />
		</div>
	)
}

export { Spinner }
