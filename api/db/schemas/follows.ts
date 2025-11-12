import { index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { snowflake } from '../shared/snowflake';
import { users } from './users';

export const follows = pgTable(
	'followers',
	{
		id: snowflake({ type: 'primary' }),
		followerId: snowflake({ type: 'foreign' }).references(() => users.id, {
			onDelete: 'cascade',
		}),
		followingId: snowflake({ type: 'foreign' }).references(() => users.id, {
			onDelete: 'cascade',
		}),
	},
	({ id, followerId, followingId }) => [
		index('follows_follower_id_index').on(followerId, id),
		index('follows_following_id_index').on(followingId, id),
		uniqueIndex('follows_follower_following_index').on(followerId, followingId),
	],
);
