export const TOOLKIT_ITEMS = [
	{
		id: 'figma',
		name: 'Figma',
		area: 'Design',
		tags: ['Graphics', 'UI/UX'],
		proficiency: 'Core',
		color: '#874fff',
		summary:
			'Where layouts start: UI, social, decks. Components and prototypes before anything hits code.',
		image: {
			lockup: {
				url: '/assets/toolkit/figma.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/figma.svg',
			},
		},
	},
	{
		id: 'adobe-cc',
		name: 'Creative Cloud',
		area: 'Design',
		tags: [],
		proficiency: 'Core',
		color: '#DA1F26',
		summary:
			'The suite around Photoshop, Illustrator, and motion. One login for everything that is not a browser tab.',
		image: {
			lockup: {
				url: '/assets/toolkit/adobe-cc.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/adobe-cc.svg',
			},
		},
	},
	{
		id: 'adobe-ps',
		name: 'Photoshop',
		area: 'Design',
		tags: ['Graphics'],
		proficiency: 'Core',
		color: '#31a8ff',
		summary:
			'Retouch, mockups, and raster composites when Figma is the wrong surface — merch, thumbs, key visuals.',
		image: {
			lockup: {
				url: '/assets/toolkit/adobe-ps.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/adobe-ps.svg',
			},
		},
	},
	{
		id: 'adobe-ai',
		name: 'Illustrator',
		area: 'Design',
		tags: ['Graphics'],
		proficiency: 'Core',
		color: '#ff9a00',
		summary:
			'Logos, stickers, merch, print. Vectors that have to scale without falling apart.',
		image: {
			lockup: {
				url: '/assets/toolkit/adobe-ai.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/adobe-ai.svg',
			},
		},
	},
	{
		id: 'adobe-ae',
		name: 'After Effects',
		area: 'Motion',
		tags: ['Animation'],
		proficiency: 'Occasional',
		color: '#9999ff',
		summary:
			'Motion for streams and events when a still frame is not enough. Occasional, not a daily seat.',
		image: {
			lockup: {
				url: '/assets/toolkit/adobe-ae.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/adobe-ae.svg',
			},
		},
	},
	{
		id: 'adobe-pr',
		name: 'Premiere Pro',
		area: 'Motion',
		tags: [],
		proficiency: 'Occasional',
		color: '#9999ff',
		summary:
			'Cutdowns, recaps, short-form edits. I open it for a job, not as a home screen.',
		image: {
			lockup: {
				url: '/assets/toolkit/adobe-pr.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/adobe-pr.svg',
			},
		},
	},
	{
		id: 'docker',
		name: 'Docker',
		area: 'Infra',
		tags: [],
		proficiency: 'Occasional',
		color: '#2560ff',
		summary:
			'Same environment locally and on the server, so deploys do not invent new surprises.',
		image: {
			lockup: {
				url: '/assets/toolkit/docker.svg',
				size: { width: 746, height: 180 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/docker.svg',
			},
		},
	},
	{
		id: 'git',
		name: 'Git',
		area: 'Infra',
		tags: [],
		proficiency: 'Core',
		color: '#f03c2e',
		summary:
			'How work gets saved, branched, and undone. Everything that ships goes through it.',
		image: {
			lockup: {
				url: '/assets/toolkit/git.svg',
				size: { width: 380, height: 180 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/git.svg',
			},
		},
	},
	{
		id: 'github',
		name: 'GitHub',
		area: 'Infra',
		tags: [],
		proficiency: 'Core',
		color: '#8534f3',
		summary:
			'Repos, PRs, Actions. Where this site and the rest of the code actually live.',
		image: {
			lockup: {
				url: '/assets/toolkit/github.svg',
				size: { width: 700, height: 200 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/github.svg',
			},
		},
	},
	{
		id: 'javascript',
		name: 'JavaScript',
		area: 'Frontend',
		tags: [],
		proficiency: 'Frequent',
		color: '#f7df1e',
		summary:
			'The language the web actually runs. I write it, inherit it, and ship it — usually with types on top.',
		image: {
			lockup: {
				url: '/assets/toolkit/javascript.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/javascript.svg',
			},
		},
	},
	{
		id: 'typescript',
		name: 'TypeScript',
		area: 'Frontend',
		tags: [],
		proficiency: 'Core',
		color: '#3178c6',
		summary:
			'Default for anything that has to last more than a weekend. Refactors without guessing.',
		image: {
			lockup: {
				url: '/assets/toolkit/typescript.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/typescript.svg',
			},
		},
	},
	{
		id: 'react',
		name: 'React',
		area: 'Frontend',
		tags: ['UI/UX'],
		proficiency: 'Core',
		color: '#58c4dc',
		summary:
			'How UI gets built after Figma: components, state, the interactive layer of the site.',
		image: {
			lockup: {
				url: '/assets/toolkit/react.svg',
				size: { width: 178, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/react.svg',
			},
		},
	},
	{
		id: 'next-js',
		name: 'Next.js',
		area: 'Frontend',
		tags: ['Fullstack'],
		proficiency: 'Frequent',
		color: '#FFFFFF',
		summary:
			'App Router, server components, this CV. The frame around React when a SPA is not enough.',
		image: {
			lockup: {
				url: '/assets/toolkit/next-js.svg',
				size: { width: 794, height: 260 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/next-js.svg',
			},
		},
	},
	{
		id: 'vercel',
		name: 'Vercel',
		area: 'Infra',
		tags: ['Fullstack'],
		proficiency: 'Frequent',
		color: '#FFFFFF',
		summary:
			'Push and it is live. Preview URLs for every change, no ritual around deploy.',
		image: {
			lockup: {
				url: '/assets/toolkit/vercel.svg',
				size: { width: 800, height: 240 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/vercel.svg',
			},
		},
	},
	{
		id: 'nest-js',
		name: 'NestJS',
		area: 'Backend',
		tags: [],
		proficiency: 'Frequent',
		color: '#e0234e',
		summary:
			'Structured Node APIs when a couple of route files stop being honest. Modules, not a junk drawer.',
		image: {
			lockup: {
				url: '/assets/toolkit/nest-js.svg',
				size: { width: 155, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/nest-js.svg',
			},
		},
	},
	{
		id: 'node-js',
		name: 'Node.js',
		area: 'Backend',
		tags: [],
		proficiency: 'Occasional',
		color: '#5FA04E',
		summary:
			'Scripts, tooling, the layer under Nest. I do not live in it all day — it just has to work.',
		image: {
			lockup: {
				url: '/assets/toolkit/node-js.svg',
				size: { width: 142, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/node-js.svg',
			},
		},
	},
	{
		id: 'telegram-mini-apps',
		name: 'Mini Apps',
		area: 'Frontend',
		tags: [],
		proficiency: 'Occasional',
		color: '#29a9eb',
		summary:
			'Telegram as the shell, web as the product. How RUSH B shipped to 10K+ MAU without an app store.',
		image: {
			lockup: {
				url: '/assets/toolkit/telegram.svg',
				size: { width: 160, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/telegram.svg',
			},
		},
	},
	{
		id: 'tailwindcss',
		name: 'Tailwind CSS',
		area: 'Frontend',
		tags: ['UI/UX'],
		proficiency: 'Core',
		color: '#06B6D4',
		summary:
			'Utilities and tokens, not a graveyard of CSS files. Design system speed without leaving the markup.',
		image: {
			lockup: {
				url: '/assets/toolkit/tailwindcss.svg',
				size: { width: 1270, height: 160 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/tailwindcss.svg',
			},
		},
	},
	{
		id: 'redux-toolkit',
		name: 'Redux Toolkit',
		area: 'Frontend',
		tags: [],
		proficiency: 'Occasional',
		color: '#764ABC',
		summary:
			'A real store for the rare case client state actually needs one. Kept occasional on purpose.',
		image: {
			lockup: {
				url: '/assets/toolkit/redux-toolkit.svg',
				size: { width: 169, height: 160 },
				label: true,
			},
			icon: {
				url: '/assets/toolkit/icons/redux-toolkit.svg',
			},
		},
	},
	{
		id: 'vite',
		name: 'Vite',
		area: 'Frontend',
		tags: [],
		proficiency: 'Frequent',
		color: '#8900FF',
		summary:
			'Instant local builds outside Next. Experiments, Storybook, small apps that should not wait on a bundler.',
		image: {
			lockup: {
				url: '/assets/toolkit/vite.svg',
				size: { width: 928, height: 280 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/vite.svg',
			},
		},
	},
	{
		id: 'storybook',
		name: 'Storybook',
		area: 'Frontend',
		tags: ['UI/UX'],
		proficiency: 'Occasional',
		color: '#FF4785',
		summary:
			'Build a component in isolation before it disappears into a page. Useful, not a religion.',
		image: {
			lockup: {
				url: '/assets/toolkit/storybook.svg',
				size: { width: 800, height: 160 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/storybook.svg',
			},
		},
	},
	{
		id: 'motion',
		name: 'Motion',
		area: 'Frontend',
		tags: [],
		proficiency: 'Occasional',
		color: '#fbd509',
		summary:
			'UI motion in code: fades, layout shifts, page transitions. No After Effects export required.',
		image: {
			lockup: {
				url: '/assets/toolkit/motion.svg',
				size: { width: 450, height: 240 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/motion.svg',
			},
		},
	},
	{
		id: 'prisma',
		name: 'Prisma',
		area: 'Backend',
		tags: [],
		proficiency: 'Occasional',
		color: '#14b8a6',
		summary:
			'Typed schema and queries when the database is mine to shape. Less SQL archaeology, more shipping.',
		image: {
			lockup: {
				url: '/assets/toolkit/prisma.svg',
				size: { width: 532, height: 160 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/prisma.svg',
			},
		},
	},
	{
		id: 'tanstack',
		name: 'Tanstack',
		area: 'Frontend',
		tags: [],
		proficiency: 'Occasional',
		color: '#FF5F5F',
		summary:
			'Tables, queries, the unglamorous data UI. When a list is actually a product, not a map().',
		image: {
			lockup: {
				url: '/assets/toolkit/tanstack.svg',
				size: { width: 1028, height: 160 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/tanstack.svg',
			},
		},
	},
	{
		id: 'cloudflare',
		name: 'Cloudflare',
		area: 'Infra',
		tags: [],
		proficiency: 'Occasional',
		color: '#F78100',
		summary:
			'R2, CDN, edge. Where assets on this site actually sit, without a DIY bucket ritual.',
		image: {
			lockup: {
				url: '/assets/toolkit/cloudflare.svg',
				size: { width: 1100, height: 160 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/cloudflare.svg',
			},
		},
	},
	{
		id: 'supabase',
		name: 'Supabase',
		area: 'Backend',
		tags: ['Fullstack'],
		proficiency: 'Occasional',
		color: '#3ECF8E',
		summary:
			'Postgres, auth, RLS — the admin stack on this CV. A database without standing up a box.',
		image: {
			lockup: {
				url: '/assets/toolkit/supabase.svg',
				size: { width: 824, height: 160 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/supabase.svg',
			},
		},
	},
	{
		id: 'cursor',
		name: 'Cursor',
		area: 'Infra',
		tags: ['AI', 'Fullstack'],
		proficiency: 'Core',
		color: '#EDECEC',
		summary:
			'Daily driver. Writes with me, does not replace the design eye. This site was built in it.',
		image: {
			lockup: {
				url: '/assets/toolkit/cursor.svg',
				size: { width: 674, height: 160 },
				label: false,
			},
			icon: {
				url: '/assets/toolkit/icons/cursor.svg',
			},
		},
	},
]
