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
					name: '@me',
					description: 'Routes related to the user current session',
				},
				{
					name: 'Sessions',
					description: 'Routes related to user sessions',
				},
				{
					name: 'Connections',
					description: 'Routes related to connections in an users account',
				},
				{
					name: 'Security',
					description: 'Route related to security of an account',
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
