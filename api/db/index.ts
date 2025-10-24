import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env, IS_DEVELOPMENT } from '@/env';

import * as relations from './relations';
import * as schemas from './schemas';

const pool = new Pool({
	max: 20,
	idleTimeoutMillis: 30000,
	connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
	logger: IS_DEVELOPMENT,
	schema: { ...schemas, ...relations },
});
