export function getAdminVkIds() {
	return (process.env.ADMIN_VK_IDS ?? '')
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean)
		.map(Number)
		.filter((id) => Number.isFinite(id))
}

export function isAdminVkId(vkId: number) {
	return getAdminVkIds().includes(vkId)
}
