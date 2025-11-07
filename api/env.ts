import { Parse } from '@sinclair/typebox/value';
import { t } from 'elysia';

const MAX_TCP_PORT_NUMBER = 65_535;

const ENV_SCHEMA = t.Object({
	// App
	ORIGIN: t.String({ format: 'uri' }),
	JWT_SECRET: t.String({ minLength: 40 }),
	APP_NAME: t.String({ default: 'Clarice' }),
	ADMINS_ID: t.Array(t.String(), { default: [] }),
	PORT: t.Integer({ minimum: 0, maximum: MAX_TCP_PORT_NUMBER }),

	// Database
	DATABASE_URL: t.String({ format: 'uri' }),

	// Enviroment
	NODE_ENV: t.String({ default: 'development' }),

	// SMTP Service (Email)
	DOMAIN: t.String(),
	SMTP_USER: t.String(),
	SMTP_HOST: t.String(),
	SMTP_PORT: t.Integer(),
	SMTP_PASSWORD: t.String(),
	SMTP_SECURE: t.BooleanString({ default: false }),

	// S3 Service (MinIO)
	S3_ACCESS_KEY_ID: t.String(),
	S3_SECRET_ACCESS_KEY: t.String(),
	S3_ENDPOINT: t.String({ format: 'uri' }),

	// Git
	GIT_COMMIT: t.Optional(t.String()),
});

export const env = Parse(ENV_SCHEMA, process.env);

export const IS_DEVELOPMENT = env.NODE_ENV !== 'production';
