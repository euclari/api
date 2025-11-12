import { t } from 'elysia';

export const Email = (description?: string) =>
	t.String({
		description,
		maxLength: 155,
		format: 'email',
		error: 'Unknown email format',
		examples: ['hello@euclari.com.br'],
	});
