import { index, pgTable } from 'drizzle-orm/pg-core';
import { snowflake } from '../shared/snowflake';
import { users } from './users';

const SEVEN_DAYS_IN_MS = 6.048e8;

export const sessions = pgTable(
	'sessions',
	({ text, varchar, timestamp }) => ({
		id: snowflake({ type: 'primary' }),
		userId: snowflake({ type: 'foreign' }).references(() => users.id, {
			onDelete: 'cascade',
		}),
		city: text(),
		region: text(),
		ip: varchar({ length: 45 }),
		agent: varchar({ length: 264 }),
		device: varchar({ length: 64 }),
		hash: text().unique().notNull(),
		expiresAt: timestamp({ withTimezone: true }).$defaultFn(
			() => new Date(Date.now() + SEVEN_DAYS_IN_MS),
		),
	}),
	({ userId, expiresAt }) => [
		index('sessions_user_id_index').on(userId),
		index('sessions_expires_at_index').on(expiresAt),
	],
);
