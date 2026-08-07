import { Toaster as RootToaster } from 'sonner'

import { Spinner } from 'ui/blocks'
import {
	Icon24CancelOutline,
	Icon28CheckCircleOn,
	Icon28ErrorCircleOutline,
	Icon28HelpCircleOutline,
	Icon28WarningTriangleOutline,
} from '@vkontakte/icons'

export function Toaster() {
	return (
		<RootToaster
			expand={true}
			theme='dark'
			// position={smallerOrEqual('md') ? 'top-center' : 'bottom-right'}
			offset={{ top: 104, bottom: 16, right: 16, left: 16 }}
			mobileOffset={{ top: 104, bottom: 16, right: 16, left: 16 }}
			swipeDirections={['top', 'right']}
			visibleToasts={5}
			gap={8}
			icons={{
				success: <Icon28CheckCircleOn width={28} height={28} />,
				info: <Icon28HelpCircleOutline width={28} height={28} />,
				warning: <Icon28WarningTriangleOutline width={28} height={28} />,
				error: <Icon28ErrorCircleOutline width={28} height={28} />,
				close: <Icon24CancelOutline width={28} height={28} />,
				loading: <Spinner className='text-foreground-secondary' size={28} />,
			}}
			toastOptions={{
				unstyled: true,
				classNames: {
					toast:
						'w-80 flex p-4 gap-3 border border-separator rounded-[31px]',
					content: 'flex flex-1 flex-col gap-2 select-none',
					title: 'text-xl font-condensed font-medium',
					description: 'text-sm !text-foreground-secondary',
					loader: '',
					closeButton: '',
					cancelButton: '',
					actionButton: 'font-condensed rounded',
					success: 'text-success',
					info: 'text-info',
					error: 'text-danger',
					warning: 'text-warning',
					loading: '',
					default: 'bg-surface',
					icon: 'relative w-7 h-7 m-0 flex items-center justify-center',
				},
			}}
		/>
	)
}
