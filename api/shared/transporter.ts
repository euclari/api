import { createTransport } from 'nodemailer';
import { env, IS_DEVELOPMENT } from '@/env';

export const transporter = createTransport({
	pool: true,
	port: env.SMTP_PORT,
	host: env.SMTP_HOST,
	debug: IS_DEVELOPMENT,
	secure: env.SMTP_SECURE,
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASSWORD,
	},
});
