'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import { deleteArticle, type Article } from 'lib/articles'

import { Button } from 'ui/blocks'

type DeleteArticleDialogProps = {
	article: Article
	onCancel: () => void
	onSuccess: () => void
}

export function DeleteArticleDialog({
	article,
	onCancel,
	onSuccess,
}: DeleteArticleDialogProps) {
	const [pending, startTransition] = useTransition()

	function confirm() {
		startTransition(async () => {
			const result = await deleteArticle(article.id)
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success('Статья удалена')
			onSuccess()
		})
	}

	return (
		<div className="flex flex-col bg-surface border border-separator rounded-surface">
			<div className="flex flex-col p-surface gap-surface">
				<div className="flex flex-1 flex-col gap-3">
					<h3 className="text-xl font-medium font-condensed tracking-tight">
						Delete article?
					</h3>

					<p className="text-sm text-foreground-secondary">
						«{article.title}» will be permanently deleted.
					</p>
				</div>

				<div className="flex justify-end gap-2">
					<Button
						size="sm"
						type="button"
						mode="secondary"
						appearance="neutral"
						onClick={onCancel}
						disabled={pending}
					>
						Cancel
					</Button>

					<Button
						size="sm"
						type="button"
						appearance="danger"
						onClick={confirm}
						disabled={pending}
					>
						Yes, delete it
					</Button>
				</div>
			</div>
		</div>
	)
}
