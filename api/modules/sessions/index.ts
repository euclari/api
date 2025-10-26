import type { app } from '@/app';
import { IS_DEVELOPMENT } from '@/env';
import { hashRefresh } from '@/shared/auth';
import { SessionModel } from './model';
import { SessionService } from './service';

export const route = (elysia: typeof app) =>
	elysia.group('/sessions', (sessions) =>
		sessions
			.guard({ tags: ['Sessions'] })
			.delete(
				'/@me',
				async ({ user: { id }, cookie: { access, refresh } }) => {
					await SessionService.signOut({
						userId: id,
						token: hashRefresh(refresh.value as string),
					});

					access.remove();
					refresh.remove();
				},
				{ secure: true },
			)
			.delete(
				'',
				async ({ user: { id }, cookie: { access, refresh } }) => {
					await SessionService.sweep({ userId: id });

					access.remove();
					refresh.remove();
				},
				{ secure: true },
			)
			.post('/otp', async ({ body }) => SessionService.genOTPCode({ body }), {
				body: SessionModel.GEN_OTP_CODE_SCHEMA,
			})
			.post(
				'/signup',
				async ({ body, cookie, server, headers, request }) => {
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

					return user;
				},
				{
					body: SessionModel.SIGN_UP_SCHEMA,
				},
			)
			.post(
				'',
				async ({ body, cookie, server, headers, request }) => {
					const { user, session } = await SessionService.signIn({
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

					return user;
				},
				{
					body: SessionModel.SIGN_IN_SCHEMA,
				},
			)
			.patch(
				'/:id',
				({ body, params: { id }, user: { id: userId } }) =>
					SessionService.update({ body, userId, id: BigInt(id) }),
				{
					secure: true,
					body: SessionModel.UPDATE_SCHEMA,
				},
			),
	);
