import { relations } from 'drizzle-orm';
import { sessions, users } from './schemas';

const user = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));

const session = relations(sessions, ({ one }) => ({
	user: one(users, {
		references: [users.id],
		fields: [sessions.userId],
	}),
}));

export { user, session };
