import { twMerge } from 'tailwind-merge'

import type SpinnerProps from './Spinner.interface'

import { Icon24Spinner } from '@vkontakte/icons'

const Spinner: React.FC<SpinnerProps> = props => {
	const { size = 28, width = 28, height = 28, className, ...restProps } = props

	const computedStyle = {
		width,
		height,
	}

	return (
		<div {...restProps} className={twMerge('w-fit', className)}>
			<Icon24Spinner style={computedStyle} className='animate-spin' />
		</div>
	)
}

export { Spinner }
