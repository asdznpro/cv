'use client'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { SHORT_LINK_HOST, shortLinkHref, type ShortLink } from 'lib/short-links'

import { Badge, Button, Separator } from 'ui/blocks'
import { useOverlay } from 'ui/overlays'

import {
	Icon24DeleteOutline,
	Icon24PenOutline,
	Icon28CalendarOutline,
	Icon28ChainOutline,
	Icon28CopyOutline,
	Icon28UsersOutline,
	Icon28ViewOutline,
} from '@vkontakte/icons'

import { CreateShortLinkForm } from './CreateShortLinkForm'
import { DeleteShortLinkDialog } from './DeleteShortLinkDialog'
import { ShortLinkFormDialog } from './ShortLinkFormDialog'

type ShortenerManagerProps = {
	links: ShortLink[]
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat('en-CA', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date(value))
}

export function ShortenerManager({ links }: ShortenerManagerProps) {
	const { open, close } = useOverlay()
	const router = useRouter()

	const openEdit = (link: ShortLink) => {
		open(
			<ShortLinkFormDialog
				link={link}
				onCancel={() => close()}
				onSuccess={() => {
					close()
					router.refresh()
				}}
			/>,
		)
	}

	const openDelete = (link: ShortLink) => {
		open(
			<DeleteShortLinkDialog
				link={link}
				onCancel={() => close()}
				onSuccess={() => {
					close()
					router.refresh()
				}}
			/>,
		)
	}

	async function copyHref(slug: string) {
		try {
			await navigator.clipboard.writeText(shortLinkHref(slug))
			toast.success('Ссылка скопирована')
		} catch {
			toast.error('Не удалось скопировать')
		}
	}

	return (
		<>
			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-12'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-5xl text-balance font-medium font-condensed tracking-tight'>
						URL Shortener
					</h1>

					<p className='text-foreground-secondary text-balance'>
						Create short links to your website or social media profiles
					</p>
				</div>

				<div className='relative flex'>
					<CreateShortLinkForm />

					<span className='-z-1 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 container w-[160%] aspect-square animate-[fade-in_500ms_ease-out] bg-radial from-accent/20 to-60% to-background pointer-events-none' />
				</div>
			</section>

			<section className='mx-auto max-w-2xl w-full flex flex-col px-app gap-app'>
				<div className='flex gap-app not-first-of-type:pt-8 pb-3'>
					<div className='flex flex-col gap-3'>
						<h2 className='flex-1 text-3xl font-medium font-condensed tracking-tight'>
							Shortened Links
						</h2>

						<p className='text-foreground-secondary text-balance'>
							Manage redirects for {SHORT_LINK_HOST}
						</p>
					</div>
				</div>

				{links.length === 0 ? (
					<p className='text-foreground-secondary'>Пока нет коротких ссылок</p>
				) : (
					<div className='flex flex-col bg-surface border border-separator rounded-surface'>
						{links.map((link, index) => (
							<div key={link.id}>
								<div className='flex items-center p-surface gap-surface'>
									<div className='flex flex-1 flex-col gap-3 min-w-0'>
										<a
											href={shortLinkHref(link.slug)}
											target='_blank'
											rel='noopener noreferrer'
											className='root w-fit text-xl font-medium font-condensed tracking-tight hover:underline hover:text-link transition-colors'
										>
											{SHORT_LINK_HOST}/{link.slug}
										</a>

										<span className='flex flex-wrap gap-1'>
											<Badge
												size='md'
												mode='soft'
												appearance={link.clicks_24h > 0 ? 'success' : 'neutral'}
												prefix={<Icon28ViewOutline width={14} height={14} />}
												title='Clicks (last 24h in parentheses)'
											>
												{link.clicks}
												{link.clicks_24h > 0 && ' +' + link.clicks_24h}
											</Badge>

											<Badge
												size='md'
												mode='soft'
												appearance={
													link.uniques_24h > 0 ? 'success' : 'neutral'
												}
												prefix={<Icon28UsersOutline width={14} height={14} />}
												title='Unique visitors (last 24h in parentheses)'
											>
												{link.unique_visitors ?? 0}
												{link.uniques_24h > 0 && ' +' + link.uniques_24h}
											</Badge>

											<Badge
												size='md'
												mode='soft'
												appearance='neutral'
												prefix={
													<Icon28CalendarOutline width={14} height={14} />
												}
											>
												{formatDate(link.created_at)}
											</Badge>

											<Badge
												className='max-w-52'
												size='md'
												mode='soft'
												appearance='neutral'
												prefix={<Icon28ChainOutline width={14} height={14} />}
											>
												{link.target_url}
											</Badge>
										</span>
									</div>

									<div className='flex gap-2 shrink-0'>
										<Button
											aria-label='Copy'
											mode='soft'
											appearance='neutral'
											prefix={<Icon28CopyOutline width={18} height={18} />}
											onClick={() => copyHref(link.slug)}
											iconOnly
										/>

										<Button
											aria-label='Edit'
											mode='soft'
											appearance='neutral'
											prefix={<Icon24PenOutline width={18} height={18} />}
											onClick={() => openEdit(link)}
											iconOnly
										/>

										<Button
											aria-label='Delete'
											mode='soft'
											appearance='danger'
											prefix={<Icon24DeleteOutline width={18} height={18} />}
											onClick={() => openDelete(link)}
											iconOnly
										/>
									</div>
								</div>

								{index !== links.length - 1 && <Separator />}
							</div>
						))}
					</div>
				)}
			</section>
		</>
	)
}
