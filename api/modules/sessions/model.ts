import { type Static, t } from 'elysia';
import { Email } from '@/shared/typebox/email';
import { Snowflake } from '@/shared/typebox/snowflake';

export namespace SessionModel {
	export interface LogOutOptions {
		id: bigint;
		token: string;
	}

	export interface SweepOptions {
		id?: bigint;
	}

	export interface RenewOptions extends Omit<LogInOptions, 'body'> {
		id: bigint;
		token: string;
	}

	export const LOG_IN_SCHEMA = t.Object({
		email: Email('Current email of the users account'),
		password: t.String({ minLength: 8, maxLength: 72 }),
	});

	export interface LogInOptions {
		ip?: string;
		agent?: string;
		body: typeof LOG_IN_SCHEMA.static;
	}

	export const REMOVE_SESSION_PARAMS = t.Object({
		id: t.Transform(t.String()).Decode(BigInt).Encode(String),
	});

	export interface RemoveOptions extends Static<typeof REMOVE_SESSION_PARAMS> {
		userId: bigint;
	}

	export const GEN_OTP_CODE_SCHEMA = t.Object({
		email: Email('An email to send the OTP code to verify the account'),
	});

	export interface GenOTPCodeOptions {
		body: typeof GEN_OTP_CODE_SCHEMA.static;
	}

	export const SIGN_UP_SCHEMA = t.Object({
		code: t.String(),
		name: t.String({ pattern: '^(?!.*(?:clarice|admin))[a-z0-9_]{4,30}$' }),
		password: t.String({
			pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,128}$',
		}),
		email: Email('The email used before in the OTP code'),
		preferences: t.Partial(
			t.Object({
				rytm: t.Integer({ minimum: 1, maximum: 6 }),
				// TODO: Add genres enum later
				genres: t.Array(t.String(), { maxItems: 15 }),
				authors: t.Array(Snowflake, { maxItems: 15 }),
				format: t.UnionEnum(['EBOOK', 'AUDIOBOOK', 'PHYSICAL']),
			}),
		),
	});

	export interface SignUpOptions {
		ip?: string;
		agent?: string;
		body: typeof SIGN_UP_SCHEMA.static;
	}
}
