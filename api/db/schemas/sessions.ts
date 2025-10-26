import { index, pgTable } from 'drizzle-orm/pg-core';
import { snowflake } from '../shared/snowflake';
import { users } from './users';

const SEVEN_DAYS_IN_MS = 6.048e8;
const REFRESH_TOKEN_HASH_LEN = 64;

export const sessions = pgTable(
	'sessions',
	({ char, varchar, timestamp }) => ({
		id: snowflake({ type: 'primary' }),
		userId: snowflake({ type: 'foreign' }).references(() => users.id, {
			onDelete: 'cascade',
		}),
		ip: varchar({ length: 45 }),
		slug: varchar({ length: 26 }),
		agent: varchar({ length: 264 }),
		device: varchar({ length: 64 }),
		hash: char({ length: REFRESH_TOKEN_HASH_LEN }).unique().notNull(),
		expiresAt: timestamp({ withTimezone: true }).$defaultFn(
			() => new Date(Date.now() + SEVEN_DAYS_IN_MS),
		),
	}),
	({ userId, expiresAt }) => [
		index('session_user_id_idx').on(userId),
		index('session_expires_idx').on(expiresAt),
	],
);
