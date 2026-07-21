import { cva } from 'class-variance-authority'

export const previewCardVariants = cva(
	// base

	['relative w-full inline-flex'],

	{
		variants: {
			ratio: {
				'4:1': 'aspect-[4/1]',
				'3:1': 'aspect-[3/1]',
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
				'1:3': 'aspect-[1/3]',
				'1:4': 'aspect-[1/4]',
				auto: 'aspect-auto',
			},

			radius: {
				none: '[&>.in]:rounded-none rounded-none',
				base: '[&>.in]:rounded-xl rounded-xl',
				full: '[&>.in]:rounded-full rounded-full',
			},
		},

		defaultVariants: {
			ratio: 'video',
			radius: 'base',
		},
	},
)
