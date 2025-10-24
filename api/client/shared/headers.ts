import { env } from '@/env';

export const CORE_HEADERS = {
	// Security
	'x-xss-protection': '0',
	'x-frame-options': 'deny',
	'referrer-policy': 'no-referrer',
	'x-content-type-options': 'nosniff',
	'cross-origin-opener-policy': 'same-origin',
	'cross-origin-resource-policy': 'same-origin',
	'cross-origin-embedder-policy': 'require-corp',
	'content-security-policy': "default-src 'none'",

	// Cache
	pragma: 'no-cache',
	'cache-control': 'no-store',

	// CORS
	'access-control-expose-headers': 'ETag',
	'access-control-allow-origin': env.ORIGIN,
	'access-control-allow-credentials': 'true',
	'access-control-allow-headers': 'Content-Type',
	'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};
