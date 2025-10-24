import { openapi } from '@elysiajs/openapi';
import { IS_DEVELOPMENT } from '@/env';

export const docs = () =>
	openapi({
		documentation: {
			info: {
				title: 'Clarice API',
				version: '0.0.1-2025-beta',
				description: 'API for the Clarice app',
			},
			tags: [
				{
					name: 'Sessions',
					description: 'Routes related to user sessions',
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
