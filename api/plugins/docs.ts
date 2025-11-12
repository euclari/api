import { openapi } from '@elysiajs/openapi';
import { IS_DEVELOPMENT } from '@/env';

export const docs = openapi({
	documentation: {
		info: {
			title: 'Clarice API',
			version: '0.0.1-2025-beta',
			description: 'API for the Clarice app',
		},
		tags: [
			{
				name: '@me',
			},
			{
				name: 'Sessions',
			},
			{
				name: 'Users',
			},
			{
				name: 'API',
			},
		],
	},
	swagger: {
		autoDarkMode: true,
	},
	path: '/docs',
	provider: 'scalar',
	enabled: IS_DEVELOPMENT,
});
