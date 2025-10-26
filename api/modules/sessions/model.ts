import { t } from 'elysia';

export namespace SessionModel {
	export interface SignOutOptions {
		token: string;
		userId: bigint;
	}

	const MAX_ARGON2ID_LENGTH = 118;

	export const SIGN_IN_SCHEMA = t.Object({
		email: t.String({ format: 'email', maxLength: 115 }),
		password: t.String({ minLength: 8, maxLength: MAX_ARGON2ID_LENGTH }),
	});

	export interface SignInOptions {
		ip?: string;
		agent?: string;
		body: typeof SIGN_IN_SCHEMA.static;
	}

	export const GEN_OTP_CODE_SCHEMA = t.Pick(SIGN_IN_SCHEMA, ['email']);

	export interface GenerateOTPCodeOptions {
		body: typeof GEN_OTP_CODE_SCHEMA.static;
	}

	export const SIGN_UP_SCHEMA = t.Intersect([
		GEN_OTP_CODE_SCHEMA,
		t.Object({
			preferences: t.Object({
				genres: t.Array(t.String(), { default: [] }),
				rytm: t.Integer({ minimum: 1, maximum: 6, default: 2 }),
				format: t.Optional(t.UnionEnum(['EBOOK', 'AUDIOBOOK', 'PHYSICAL'])),
				authors: t.Array(
					t.Transform(t.String()).Decode(BigInt).Encode(String),
					{ default: [] },
				),
			}),
			code: t.String({ pattern: '^[A-Z]{,7}$' }),
			name: t.String({ pattern: '^(?!.*(?:clarice|admin))[a-z0-9_]{4,15}$' }),
			password: t.String({
				pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,52}$',
			}),
		}),
	]);

	export interface SignUpOptions extends Omit<SignInOptions, 'body'> {
		body: typeof SIGN_UP_SCHEMA.static;
	}

	export interface SweepOptions {
		userId?: bigint;
	}

	export const UPDATE_SCHEMA = t.Object({
		slug: t.Nullable(t.String({ minLength: 5, maxLength: 26 })),
	});

	export interface UpdateOptions {
		id: bigint;
		userId: bigint;
		body: typeof UPDATE_SCHEMA.static;
	}
}
