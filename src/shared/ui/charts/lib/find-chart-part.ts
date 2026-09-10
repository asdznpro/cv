import {
	Children,
	isValidElement,
	type ComponentType,
	type ReactNode,
} from 'react'

export function findChartPart<P>(
	children: ReactNode,
	type: ComponentType<P>,
): P | undefined {
	let found: P | undefined

	Children.forEach(children, child => {
		if (isValidElement(child) && child.type === type) {
			found = child.props as P
		}
	})

	return found
}

export function findChartParts<P>(
	children: ReactNode,
	type: ComponentType<P>,
): P[] {
	const found: P[] = []

	Children.forEach(children, child => {
		if (isValidElement(child) && child.type === type) {
			found.push(child.props as P)
		}
	})

	return found
}
