import { createHash, randomBytes } from 'node:crypto';
import { Parse } from '@sinclair/typebox/value';
import { t } from 'elysia';
import { createSigner, createVerifier } from 'fast-jwt';
import { env } from '@/env';

const { JWT_SECRET } = env;

const signer = createSigner({
	key: JWT_SECRET,
	expiresIn: '15m',
});

const verifier = createVerifier({
	key: JWT_SECRET,
});

const AUTH_SCHEMA = t.Object({
	id: t.Transform(t.BigInt()).Decode(String).Encode(BigInt),
});

type GenCredentialOptions = typeof AUTH_SCHEMA.static;

export const hashRefresh = (refresh: string) =>
	createHash('sha256').update(refresh).digest('hex');

export const genCredentials = (data: GenCredentialOptions) => {
	const token = randomBytes(42).toHex();

	return {
		refresh: {
			token,
			hash: hashRefresh(token),
		},
		access: signer(data),
	};
};

export const verify = (token: string) => {
	try {
		return Parse(AUTH_SCHEMA, verifier(token));
	} catch {}
};
