import type { app } from '@/app';
import { IS_DEVELOPMENT } from '@/env';
import { hashRefresh } from '@/shared/auth';
import { SessionModel } from './model';
import { SessionService } from './service';

export const route = (elysia: typeof app) =>
	elysia.group('/sessions', (sessions) =>
		sessions
			.guard({ tags: ['Sessions'] })
			.post(
				'/otp',
				async ({ body }) => {
					await SessionService.genOTPCode({ body });
				},
				{
					body: SessionModel.GEN_OTP_CODE_SCHEMA,
				},
			)
			.delete(
				'',
				async ({ user: { id }, cookie: { access, refresh } }) => {
					await SessionService.sweep({ id });

					access.remove();
					refresh.remove();
				},
				{
					auth: true,
				},
			)
			.delete(
				'/:id',
				({ params: { id }, user: { id: userId } }) =>
					SessionService.remove({ id, userId }),
				{
					auth: true,
					params: SessionModel.REMOVE_SESSION_PARAMS,
				},
			)
			.delete(
				'/@me',
				async ({ user: { id }, cookie: { access, refresh } }) => {
					await SessionService.logOut({
						id,
						token: hashRefresh(refresh.value as string),
					});

					access.remove();
					refresh.remove();
				},
				{ auth: true },
			)
			.post(
				'/@me/renew',
				async ({ cookie, server, headers, request, user: { id } }) => {
					const { access, refresh } = await SessionService.renew({
						id,
						agent: headers['user-agent'],
						ip: server?.requestIP(request)?.address,
						token: hashRefresh(cookie.refresh.value as string),
					});

					const SEVEN_DAYS_IN_SEC = 604800;
					const isProduction = !IS_DEVELOPMENT;

					cookie.access.set({
						value: access,
						httpOnly: true,
						secure: isProduction,
						maxAge: SEVEN_DAYS_IN_SEC,
					});

					cookie.refresh.set({
						value: refresh,
						httpOnly: true,
						sameSite: 'strict',
						secure: isProduction,
						maxAge: SEVEN_DAYS_IN_SEC,
					});

					cookie.provider.set({
						httpOnly: true,
						value: 'Clarice',
						sameSite: 'strict',
						secure: isProduction,
					});
				},
				{
					auth: true,
				},
			)
			.post(
				'',
				async ({ body, server, cookie, headers, request }) => {
					const ip = server?.requestIP(request)?.address;

					const { user, session } = await SessionService.logIn({
						ip,
						body,
						agent: headers['user-agent'],
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
					body: SessionModel.LOG_IN_SCHEMA,
				},
			),
	);
