import { index, pgTable } from 'drizzle-orm/pg-core';
import { snowflake } from '../shared/snowflake';

const ARGON2ID_LENGTH = 118;

export const users = pgTable(
	'users',
	({ char, jsonb, varchar, boolean, timestamp }) => ({
		avatar: char({ length: 16 }),
		banner: char({ length: 16 }),
		bio: varchar({ length: 256 }),
		pronouns: varchar({ length: 15 }),
		id: snowflake({ type: 'primary' }),
		name: varchar({ length: 15 }).unique().notNull(),
		email: varchar({ length: 155 }).unique().notNull(),
		password: char({ length: ARGON2ID_LENGTH }).notNull(),
		font: jsonb().$type<{ size?: number; name?: string }>().default({}),

		private: boolean(),
		locale: varchar({
			length: 2,
			enum: ['fr', 'de', 'en', 'pt', 'es'],
		}),
		birthday: timestamp({ withTimezone: true }),
		connections: jsonb()
			.$type<
				{ type: 'X' | 'IG' | 'YTB' | 'SPOTIFY' | 'DOMAIN'; id: string }[]
			>()
			.notNull()
			.default([]),
	}),
	({ birthday }) => [index('users_birthday_index').on(birthday)],
);
