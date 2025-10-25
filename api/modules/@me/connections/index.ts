import type { app } from '@/app';
import { ConnectionService } from './service';

export const route = (elysia: typeof app) =>
	elysia.group('/users/@me/connections', (connections) =>
		connections
			.guard({
				secure: true,
				tags: ['Connections'],
			})
			/* .post(
				'/:provider',
				({ user: { id }, params: { provider } }) =>
					ConnectionService.connect({ id, provider }),
				{
					params: t.UnionEnum(['X', 'IG', 'YTB', 'DOMAIN', 'SPOTIFY']),
				},
			) */
			.delete('/:connection', ({ user: { id }, params: { connection } }) =>
				ConnectionService.remove({ id, connection }),
			),
	);
