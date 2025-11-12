import { redis } from 'bun';
import { and, eq, lte, sql } from 'drizzle-orm';
import { db } from '@/db';
import { sessions, users } from '@/db/schemas';
import { genSnow } from '@/db/shared/snowflake';
import { env } from '@/env';
import { genCredentials } from '@/shared/auth';
import { ErrorCode, exception } from '@/shared/errors';
import { identify } from '@/shared/identify';
import { transporter } from '@/shared/transporter';
import { createNewLoginEmail } from '@/templates/newLogin';
import { createOTPCodeEmail } from '@/templates/OTP';
import type { SessionModel } from './model';

export abstract class SessionService {
	public static async genOTPCode({
		body: { email },
	}: SessionModel.GenOTPCodeOptions) {
		const {
			rows: [{ exists: isCredentialUsed }],
		} = await db.execute(
			sql`SELECT EXISTS(SELECT 1 FROM users WHERE $users.email= $email)`,
		);

		if (isCredentialUsed)
			throw exception('Bad Request', ErrorCode.InvalidCredentials);

		const FIVE_MIN_IN_SEC = '300';
		const code = ['C', 'L', 'A', 'R', 'I', 'C', 'E']
			.sort(() => Math.random() - 0.5)
			.join('');

		const isEmailAlreadySent = await redis.send('SET', [
			`codes:${email}:OTP`,
			code,
			'EX',
			FIVE_MIN_IN_SEC,
			'NX',
		]);

		if (isEmailAlreadySent)
			throw exception('Bad Request', ErrorCode.OTPCodeAlreadySent);

		// TODO: Add queue system
		await transporter.sendMail({
			to: email,
			from: `"Clarice" <hello@${env.DOMAIN}>`,
			subject: 'Você está quase criando a sua conta',
			html: createOTPCodeEmail({ code, name: email.split('@', 2)[0] }),
		});

		return { code };
	}

	public static async signUp({
		ip,
		agent,
		body: { name, code, email, ...options },
	}: SessionModel.SignUpOptions) {
		const REDIS_KEY = `codes:${email}:otp`;

		const fetchedCode = await redis.get(REDIS_KEY);

		if (fetchedCode !== code)
			throw exception('Not Found', ErrorCode.UnknownOTPCode);

		const id = genSnow();
		const FOUR_MB_IN_KIB = 4096;

		const [credentials, password] = await Promise.all([
			identify({ ip, header: agent }),
			Bun.password.hash(options.password, {
				timeCost: 1,
				algorithm: 'argon2id',
				memoryCost: FOUR_MB_IN_KIB,
			}),
		]);

		const { access, refresh } = genCredentials({ id: String(id) });

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
				ip,
				userId: id,
				...credentials,
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

	public static async logOut({ id, token }: SessionModel.LogOutOptions) {
		const { rowCount } = await db
			.delete(sessions)
			.where(and(eq(sessions.hash, token), eq(sessions.userId, id)));

		if (!rowCount) throw exception('Not Found', ErrorCode.UnknownSession);
	}

	public static async logIn({
		ip,
		agent,
		body: { email, password },
	}: SessionModel.LogInOptions) {
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

		const isPasswordMatch = await Bun.password.verify(password, user.password);

		if (!isPasswordMatch)
			throw exception('Bad Request', ErrorCode.PasswordMismatch);

		const { access, refresh } = genCredentials({ id: String(user.id) });

		const id = genSnow();

		await Promise.all([
			db.insert(sessions).values({
				ip,
				id,
				userId: user.id,
				hash: refresh.hash,
				...(await identify({ ip, header: agent })),
			}),
			// TODO: Add queue system
			transporter.sendMail({
				to: email,
				from: `"Clarice" <hello@${env.DOMAIN}>`,
				html: createNewLoginEmail({ id, ip, name: user.name }),
			}),
		]);

		return {
			session: {
				access,
				refresh: refresh.token,
			},
			user: { id: String(user.id) },
		};
	}

	public static async sweep({ id }: SessionModel.SweepOptions) {
		const where = id
			? and(eq(users.id, id), lte(sessions.expiresAt, new Date()))
			: lte(sessions.expiresAt, new Date());

		const { rowCount } = await db.delete(sessions).where(where);

		return rowCount;
	}

	public static async renew({
		id,
		ip,
		token,
		agent,
	}: SessionModel.RenewOptions) {
		const { access, refresh } = genCredentials({ id: String(id) });

		const SEVEN_DAYS_IN_MS = 6.048e8;

		await db
			.update(sessions)
			.set({
				ip,
				hash: refresh.hash,
				...(await identify({ ip, header: agent })),
				expiresAt: new Date(Date.now() + SEVEN_DAYS_IN_MS),
			})
			.where(eq(sessions.hash, token));

		return { access, refresh: refresh.token };
	}

	public static async remove({ id, userId }: SessionModel.RemoveOptions) {
		const { rowCount } = await db
			.delete(sessions)
			.where(and(eq(sessions.userId, userId), eq(sessions.id, id)));

		if (!rowCount) throw exception('Not Found', ErrorCode.UnknownSession);
	}
}
