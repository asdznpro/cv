import { Vibrant } from 'node-vibrant/node'
import type { Palette } from '@vibrant/color'

const FALLBACK = '#2563eb'

export type ImagePalette = {
	vibrant: string
	darkVibrant: string
	lightVibrant: string
	muted: string
	darkMuted: string
	lightMuted: string
}

function swatchHex(palette: Palette, key: keyof Palette, fallback = FALLBACK) {
	return palette[key]?.hex ?? fallback
}

export async function getImagePalette(src: string): Promise<ImagePalette> {
	try {
		const url = src.startsWith('http')
			? src
			: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}${src}`

		const palette = await Vibrant.from(url).getPalette()

		return {
			vibrant: swatchHex(palette, 'Vibrant'),
			darkVibrant: swatchHex(palette, 'DarkVibrant'),
			lightVibrant: swatchHex(palette, 'LightVibrant'),
			muted: swatchHex(palette, 'Muted'),
			darkMuted: swatchHex(palette, 'DarkMuted'),
			lightMuted: swatchHex(palette, 'LightMuted'),
		}
	} catch {
		return {
			vibrant: FALLBACK,
			darkVibrant: FALLBACK,
			lightVibrant: FALLBACK,
			muted: FALLBACK,
			darkMuted: FALLBACK,
			lightMuted: FALLBACK,
		}
	}
}
