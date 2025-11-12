import { Elysia, ElysiaCustomStatusResponse } from 'elysia';
import { env, IS_DEVELOPMENT } from '@/env';
import { auth } from '@/plugins/auth';
import { cron } from '@/plugins/cron';
import { docs } from '@/plugins/docs';
import { ErrorCode, exception } from '@/shared/errors';
import { CORE_HEADERS } from './shared/headers';

const SIXTY_FOUR_KB_IN_BYTES = 65_536;

export const createApp = () =>
	new Elysia({
		name: env.APP_NAME,
		serve: {
			development: IS_DEVELOPMENT,
			maxRequestBodySize: SIXTY_FOUR_KB_IN_BYTES,
		},
		aot: true,
		normalize: false,
		encodeSchema: false,
		sanitize: (value) => value.trim(),
		allowUnsafeValidationDetails: IS_DEVELOPMENT,
	})
		.state('requests', 0)
		.onBeforeHandle(({ set, store, headers, request }) => {
			store.requests += 1;

			if (IS_DEVELOPMENT || request.method === 'OPTIONS') return;

			set.headers = CORE_HEADERS;

			if (headers['content-type'] !== 'application/json')
				return exception('Bad Request', ErrorCode.InvalidContentType);
		})
		.decorate('since', Date.now())
		.use(auth)
		.use(cron)
		.use(docs)
		.error({
			FAST_JWT_EXPIRED: Error,
			FAST_JWT_MALFORMED: Error,
		})
		.onError(({ code, error }) => {
			if (IS_DEVELOPMENT) console.error(error);
			if (error instanceof ElysiaCustomStatusResponse) return error;

			switch (code) {
				case 'NOT_FOUND':
					return exception('Not Found', ErrorCode.UnknownRoute);
				case 'VALIDATION':
					return exception('Bad Request', ErrorCode.InvalidJSONBody, {
						detailed: error.all,
						message: error.detail(error.message),
					});
				case 'INVALID_FILE_TYPE':
					return exception('Bad Request', ErrorCode.InvalidFileType);
				case 'FAST_JWT_MALFORMED':
					return exception('Bad Request', ErrorCode.UnknownSession);
				case 'FAST_JWT_EXPIRED':
					return exception('Unauthorized', ErrorCode.ExpiredSession);
				default:
					return exception(
						'Internal Server Error',
						ErrorCode.InternalServerError,
					);
			}
		});
