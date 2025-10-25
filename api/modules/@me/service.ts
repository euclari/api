import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { sessions, users } from '@/db/schemas';
import { ErrorCode, exception } from '@/shared/errors';
import type { UserModel } from './model';

export abstract class UserService {
	public static async update({ id, body }: UserModel.UpdateOptions) {
		const { rowCount } = await db
			.update(users)
			.set(body)
			.where(eq(users.id, id));

		if (!rowCount) throw exception('Not Found', ErrorCode.UnknownSession);
	}

	public static async get({ id }: UserModel.GetOptions) {
		const MAX_CONNECTED_DEVICES_PER_USER = 5;

		const user = await db.query.users.findFirst({
			with: {
				sessions: {
					columns: {
						hash: false,
						userId: false,
					},
					orderBy: desc(sessions.id),
					limit: MAX_CONNECTED_DEVICES_PER_USER,
				},
			},
			where: eq(users.id, id),
			columns: { id: false, password: false, passwordResetRequestedAt: false },
		});

		if (!user) throw exception('Not Found', ErrorCode.UnknownSession);

		return user;
	}
}
