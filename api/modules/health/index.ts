import type { app } from '@/app';
import { HealthService } from './service';

export const route = (elysia: typeof app) =>
	elysia.get(
		'/health',
		({ since, store: { requests } }) => HealthService.get({ since, requests }),
		{
			secure: 'admin',
		},
	);
