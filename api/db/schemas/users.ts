import { pgTable } from 'drizzle-orm/pg-core';
import { snowflake } from '../shared/snowflake';

const ARGON2ID_LENGTH = 118;

export const users = pgTable('users', ({ char, varchar }) => ({
	id: snowflake({ type: 'primary' }),
	name: varchar({ length: 15 }).unique().notNull(),
	email: varchar({ length: 155 }).unique().notNull(),
	password: char({ length: ARGON2ID_LENGTH }).notNull(),
}));
