import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type AccordionSharedProps = {
	disabled?: boolean
	children: ReactNode
}

export type AccordionSingleProps = AccordionSharedProps & {
	type?: 'single'
	collapsible?: boolean
	value?: string
	defaultValue?: string
	onValueChange?: (value: string | null) => void
}

export type AccordionMultipleProps = AccordionSharedProps & {
	type: 'multiple'
	value?: string[]
	defaultValue?: string[]
	onValueChange?: (value: string[]) => void
}

export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps

export interface AccordionItemProps {
	value: string
	disabled?: boolean
	children: ReactNode
}

export type AccordionTriggerProps = ComponentPropsWithoutRef<'button'>

/** DOM drag/animation handlers clash with the same names on `motion.div`. */
export type AccordionContentProps = Omit<
	ComponentPropsWithoutRef<'div'>,
	'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
>
