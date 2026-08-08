import { VkIdOneTap } from 'widgets/auth'

import { Button, Separator } from 'ui/blocks'
import { PixelBlast } from 'ui/effects'
import { Icon28ArrowLeftOutline } from '@vkontakte/icons'

export default function Login() {
	return (
		<>
			<span />

			<section className='mx-auto max-w-md w-full h-full flex flex-1 flex-col items-center justify-center px-app'>
				<div className='w-full flex flex-col bg-background border border-separator rounded-xl'>
					<div className='flex flex-col gap-2 p-2'>
						<Button
							to='/'
							className='w-full'
							mode='ghost'
							appearance='neutral'
							prefix={<Icon28ArrowLeftOutline width={18} height={18} />}
							align='spread'
						>
							Back to CV
						</Button>
					</div>

					<Separator />

					<div className='flex flex-col p-6 gap-6'>
						<h1 className='text-3xl font-semibold font-condensed tracking-tight uppercase'>
							Welcome, Andrew S.
							<br />
							<span className='text-foreground-tertiary'>CV / Admin Panel</span>
						</h1>

						<div className='min-h-11 flex'>
							<VkIdOneTap />
						</div>
					</div>
				</div>
			</section>

			<div className='-z-10 fixed inset-0 w-full h-screen flex flex-col bg-blue-950/40'>
				<div className='relative z-0 w-full h-full'>
					<div className='absolute inset-0 -z-10'>
						<PixelBlast
							variant='square'
							pixelSize={2}
							color='#1212ce'
							patternScale={1}
							patternDensity={1}
							enableRipples={false}
							speed={0.9}
							transparent
							edgeFade={0}
						/>
					</div>
				</div>
			</div>

			<span />
		</>
	)
}
