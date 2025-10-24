import { redis } from 'bun';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { sessions, users } from '@/db/schemas';
import { genSnow } from '@/db/shared/snowflake';
import { env } from '@/env';
import { getCredentials } from '@/shared/auth';
import { transporter } from '@/shared/email';
import { ErrorCode, exception } from '@/shared/errors';
import { createNewLoginEmail } from '@/templates/newLogin';
import { createOTPCodeEmail } from '@/templates/OTP';
import type { SessionModel } from './model';

export abstract class SessionService {
	public static async genOTPCode({
		body: { email },
	}: SessionModel.GenerateOTPCodeOptions) {
		const REDIS_KEY = `codes:${email}:otp`;

		const [
			{
				rows: [{ exists: isCredentialUsed }],
			},
			isEmailAlreadySent,
		] = await Promise.all([
			db.execute(
				sql`SELECT EXISTS(SELECT 1 FROM users WHERE ${users.email} = ${email})`,
			),
			redis.exists(REDIS_KEY),
		]);

		if (isCredentialUsed)
			throw exception('Bad Request', ErrorCode.InvalidCredentials);
		if (isEmailAlreadySent)
			throw exception('Bad Request', ErrorCode.OTPCodeAlreadySent);

		const FIVE_MIN_IN_SEC = '300';
		const code = ['C', 'L', 'A', 'R', 'I', 'C', 'E']
			.sort(() => Math.random() - 0.5)
			.join('');

		await Promise.all([
			transporter.sendMail({
				to: email,
				from: `"Clarice" <hello@${env.DOMAIN}>`,
				subject: 'Você está quase criando a sua conta',
				html: createOTPCodeEmail({ code, name: email.split('@', 2)[0] }),
			}),
			redis.send('SET', [REDIS_KEY, code, 'EX', FIVE_MIN_IN_SEC, 'NX']),
		]);
	}

	public static async signUp({
		body: { name, code, email, ...options },
	}: SessionModel.SignUpOptions) {
		const REDIS_KEY = `codes:${email}:otp`;

		const fetchedCode = await redis.get(REDIS_KEY);

		if (!fetchedCode) throw exception('Not Found', ErrorCode.UnknownOTPCode);
		if (fetchedCode !== code)
			throw exception('Bad Request', ErrorCode.UnknownOTPCode);

		const id = genSnow();
		const password = await Bun.password.hash(options.password);

		const { access, refresh } = getCredentials({ id: String(id) });

		await db.transaction(async (tx) => {
			const { rowCount } = await tx
				.insert(users)
				.values({
					id,
					name,
					email,
					password,
				})
				.onConflictDoNothing({
					target: [users.name, users.email],
				});

			if (!rowCount)
				throw exception('Bad Request', ErrorCode.InvalidCredentials);

			await tx.insert(sessions).values({
				userId: id,
				hash: refresh.hash,
			});
		});

		return {
			session: {
				access,
				refresh: refresh.token,
			},
			user: { id: String(id) },
		};
	}

	public static async signOut({ token, userId }: SessionModel.SignOutOptions) {
		const { rowCount } = await db
			.delete(sessions)
			.where(and(eq(sessions.hash, token), eq(sessions.userId, userId)));

		if (!rowCount) throw exception('Not Found', ErrorCode.UnknownSession);
	}

	public static async signIn({
		ip,
		body: { email, password },
	}: SessionModel.SignInOptions) {
		const MAX_CONNECTED_DEVICES_PER_USER = 5;

		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				password: users.password,
				sessionCount: sql<number>`
					(
						SELECT COUNT(*)
						FROM ${sessions}
						WHERE ${sessions.userId} = ${users.id}
						LIMIT ${MAX_CONNECTED_DEVICES_PER_USER}
					)
				`.as('session_count'),
			})
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!user) throw exception('Not Found', ErrorCode.UnknownSession);
		if (user.sessionCount >= MAX_CONNECTED_DEVICES_PER_USER)
			throw exception('Bad Request', ErrorCode.SessionsLimitReached);

		const isPasswordMatch = await Bun.password.verify(
			password,
			user.password,
			'argon2id',
		);

		if (!isPasswordMatch)
			throw exception('Bad Request', ErrorCode.PasswordMismatch);

		const id = genSnow();

		// @ts-expect-error
		const { access, refresh } = getCredentials({ id: user.id });

		await Promise.all([
			db.insert(sessions).values({
				id,
				userId: user.id,
				hash: refresh.hash,
			}),
			transporter.sendMail({
				to: email,
				subject: 'Novo Login Detectado',
				from: `"Clarice" <${env.DOMAIN}>`,
				html: createNewLoginEmail({ ip, id, name: user.name }),
			}),
		]);

		return {
			user: { id: String(user.id) },
			session: {
				access,
				refresh: refresh.token,
			},
		};
	}

	public static async sweep({ userId }: SessionModel.SweepOptions) {
		const MAX_CONNECTED_DEVICES_PER_USER = 5;

		await db.delete(sessions).where(
			sql`id IN (
      				SELECT id
      				FROM ${sessions}
      				WHERE ${sessions.userId} = ${userId}
        			AND ${sessions.expiresAt} <= ${new Date()}
      				ORDER BY ${sessions.expiresAt} ASC
      				LIMIT ${MAX_CONNECTED_DEVICES_PER_USER}
    			)`,
		);
	}
}
