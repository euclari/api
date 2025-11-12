import { Elysia } from 'elysia';
import { env } from '@/env';
import { verify } from '@/shared/auth';
import { ErrorCode, exception } from '@/shared/errors';

export const auth = new Elysia({ name: 'auth' }).macro({
	auth(type: true | 'admin') {
		return {
			async resolve({
				cookie: {
					access: { value: access },
				},
			}) {
				if (!access) return exception('Unauthorized', ErrorCode.UnknownSession);

				const user = verify(access as string);

				if (!user) return exception('Unauthorized', ErrorCode.UnknownSession);
				if (type === 'admin' && !env.ADMINS_ID.includes(`${user.id}`))
					return exception('Forbidden', ErrorCode.UnauthorizedContent);

				return {
					user: {
						id: BigInt(user.id),
					},
				};
			},
		};
	},
});
