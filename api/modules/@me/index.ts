import type { app } from '@/app';
import { IS_DEVELOPMENT } from '@/env';
import { SessionModel } from '../sessions/model';
import { SessionService } from '../sessions/service';
import { UserModel } from './model';
import { UserService } from './service';

export const route = (elysia: typeof app) =>
	elysia.group('/users/@me', (me) =>
		me
			.guard({ tags: ['@me'] })
			.get('', ({ user: { id } }) => UserService.get({ id }), { auth: true })
			.post(
				'',
				async ({ body, server, cookie, headers, request }) => {
					const { user, session } = await SessionService.signUp({
						body,
						agent: headers['user-agent'],
						ip: server?.requestIP(request)?.address,
					});

					const SEVEN_DAYS_IN_SEC = 604800;
					const isProduction = !IS_DEVELOPMENT;

					cookie.access.set({
						httpOnly: true,
						secure: isProduction,
						value: session.access,
						maxAge: SEVEN_DAYS_IN_SEC,
					});

					cookie.refresh.set({
						httpOnly: true,
						sameSite: 'strict',
						secure: isProduction,
						value: session.refresh,
						maxAge: SEVEN_DAYS_IN_SEC,
					});

					cookie.provider.set({
						httpOnly: true,
						value: 'Clarice',
						sameSite: 'strict',
						secure: isProduction,
					});

					return user;
				},
				{
					body: SessionModel.SIGN_UP_SCHEMA,
				},
			)
			.patch('', ({ body, user: { id } }) => UserService.update({ id, body }), {
				auth: true,
				body: UserModel.UPDATE_SCHEMA,
			}),
	);
