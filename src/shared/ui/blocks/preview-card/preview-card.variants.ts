import { cva } from 'class-variance-authority'

export const previewCardVariants = cva(
	// base

	[
		'relative w-full inline-flex',
	],

	{
		variants: {
			ratio: {
				'5:2': 'aspect-[5/2]',
				'2:1': 'aspect-[2/1]',
				video: 'aspect-video',
				'3:2': 'aspect-[3/2]',
				'4:3': 'aspect-[4/3]',
				'5:4': 'aspect-[5/4]',
				square: 'aspect-square',
				'4:5': 'aspect-[4/5]',
				'3:4': 'aspect-[3/4]',
				'2:3': 'aspect-[2/3]',
				story: 'aspect-[1/2]',
				'1:2': 'aspect-[1/2]',
				'2:5': 'aspect-[2/5]',
				auto: 'aspect-auto',
			},
		},

		defaultVariants: {
			ratio: 'video',
		},
	},
)
