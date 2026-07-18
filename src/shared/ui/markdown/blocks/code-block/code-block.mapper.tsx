import { twMerge } from 'tailwind-merge'
import type { ComponentPropsWithoutRef } from 'react'
import type { ExtraProps } from 'react-markdown'

import { CodeBlock } from './CodeBlock'

type DivProps = ComponentPropsWithoutRef<'div'> & ExtraProps
type FigureProps = ComponentPropsWithoutRef<'figure'> & ExtraProps
type FigcaptionProps = ComponentPropsWithoutRef<'figcaption'> & ExtraProps
type CodeProps = ComponentPropsWithoutRef<'code'> & ExtraProps

export function renderCodeDiv({ children, ...props }: DivProps) {
	if ('data-rehype-pretty-code-title' in props) {
		return <span data-slot='title'>{children}</span>
	}

	if ('data-rehype-pretty-code-caption' in props) {
		return (
			<span data-slot='caption' className='hidden'>
				{children}
			</span>
		)
	}

	return <div {...props}>{children}</div>
}

export function renderCodeFigure({ children, ...props }: FigureProps) {
	if ('data-rehype-pretty-code-figure' in props) {
		return (
			<figure {...props} className='code-block not-prose my-6!'>
				<CodeBlock>{children}</CodeBlock>
			</figure>
		)
	}

	return null
}

export function renderCodeFigcaption({ children, ...props }: FigcaptionProps) {
	if ('data-rehype-pretty-code-title' in props) {
		return <span data-slot='title'>{children}</span>
	}

	if ('data-rehype-pretty-code-caption' in props) {
		return (
			<span data-slot='caption' className='hidden'>
				{children}
			</span>
		)
	}

	return (
		<figcaption {...props} className='w-full flex mt-4'>
			<span className='flex-1 text-sm text-foreground-secondary text-center'>
				{children}
			</span>
		</figcaption>
	)
}

export function renderCode({ className, children, ...props }: CodeProps) {
	const isBlock =
		typeof className === 'string' && className.includes('language-')

	if (isBlock) {
		return (
			<code {...props} className={className}>
				{children}
			</code>
		)
	}

	return (
		<code
			{...props}
			className={twMerge(
				'text-[0.8em] text-foreground-secondary font-mono-var font-semibold px-1.5 py-0.5 bg-surface border border-separator rounded',
				className,
			)}
		>
			{children}
		</code>
	)
}
