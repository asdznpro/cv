const nativeWarn = console.warn.bind(console)

console.warn = (...args: unknown[]) => {
	const first = String(args[0] ?? '')
	if (
		first.includes('THREE.Clock: This module has been deprecated') ||
		first.includes('deprecated parameters for the initialization function')
	) {
		return
	}
	nativeWarn(...(args as Parameters<typeof console.warn>))
}
