import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
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
