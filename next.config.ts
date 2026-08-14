import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
	experimental: {
		viewTransition: true,
		staleTimes: {
			dynamic: 30,
		},
		serverActions: {
			// DropZone / R2 uploads go up to 20MB; default action body is 1MB.
			bodySizeLimit: '21mb',
		},
	},
}

export default nextConfig
