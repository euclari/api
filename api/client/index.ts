import { cron, Patterns } from '@elysiajs/cron';
import { Elysia, ElysiaCustomStatusResponse } from 'elysia';
import { env, IS_DEVELOPMENT } from '@/env';
import { SessionService } from '@/modules/sessions/service';
import { secure } from '@/plugins/auth';
import { docs } from '@/plugins/docs';
import { ErrorCode, exception } from '@/shared/errors';
import { CORE_HEADERS } from './shared/headers';

const SIXTY_FOUR_KB_IN_BYTES = 65_536;

export const createApp = () =>
	new Elysia({
		name: env.APP_NAME,
		serve: {
			maxRequestBodySize: SIXTY_FOUR_KB_IN_BYTES,
		},
	})
		.onBeforeHandle(({ set, headers, request }) => {
			if (IS_DEVELOPMENT || request.method === 'OPTIONS') return;

			set.headers = CORE_HEADERS;

			if (headers['content-type'] !== 'application/json')
				return exception('Bad Request', ErrorCode.InvalidContentType);
		})
		.decorate('readyAt', Date.now())
		.use(secure)
		.use(docs())
		.use(
			cron({
				catch: true,
				name: 'cron',
				async run() {
					await SessionService.sweep({});
				},
				pattern: Patterns.EVERY_HOUR,
			}),
		)
		.error({
			FAST_JWT_EXPIRED: Error,
			FAST_JWT_MALFORMED: Error,
		})
		.onError(({ set, code, error }) => {
			if (IS_DEVELOPMENT) console.error(error);

			if (error instanceof ElysiaCustomStatusResponse) {
				set.status = error.code;

				return error.response;
			}

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
