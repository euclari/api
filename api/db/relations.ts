import { relations } from 'drizzle-orm';
import { follows, sessions, users } from './schemas';

const user = relations(users, ({ many }) => ({
	sessions: many(sessions),
	following: many(follows, { relationName: 'user_following' }),
	followers: many(follows, { relationName: 'user_followers' }),
}));

const session = relations(sessions, ({ one }) => ({
	user: one(users, {
		references: [users.id],
		fields: [sessions.userId],
	}),
}));

const follow = relations(follows, ({ one }) => ({
	follower: one(users, {
		references: [users.id],
		fields: [follows.followerId],
		relationName: 'user_following',
	}),
	following: one(users, {
		references: [users.id],
		fields: [follows.followingId],
		relationName: 'user_followers',
	}),
}));

export { user, follow, session };
