import type { app } from '@/app';
import { UserModel } from './model';
import { UserService } from './service';

export const route = (elysia: typeof app) =>
	elysia.group('/users/@me', (me) =>
		me
			.guard({ tags: ['@me'], secure: true })
			.get('', ({ user: { id } }) => UserService.get({ id }))
			.patch('', ({ body, user: { id } }) => UserService.update({ id, body }), {
				body: UserModel.UPDATE_SCHEMA,
			}),
	);
