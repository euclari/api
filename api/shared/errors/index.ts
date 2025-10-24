import { status as genStatus, type StatusMap } from 'elysia';
import { ERROR_MESSAGES, ErrorCode } from './messages';

export const exception = (
	status: keyof StatusMap,
	code: ErrorCode,
	errors?: unknown,
) => genStatus(status, { code, errors, message: ERROR_MESSAGES[code] });

export { ErrorCode };
