import { and, desc, eq, lt, sql } from 'drizzle-orm';
import { db } from '@/db';
import { follows, users } from '@/db/schemas';
import { ErrorCode, exception } from '@/shared/errors';
import type { FollowModel } from './model';

export abstract class FollowService {
	public static async follow({
		userId,
		targetId,
	}: FollowModel.FollowOrUnfollowOptions) {
		if (userId === targetId)
			throw exception('Conflict', ErrorCode.CannotFollowThisUser);

		await db.transaction(async (tx) => {
			const { rowCount } = await tx
				.insert(follows)
				.values({
					followerId: userId,
					followingId: targetId,
				})
				.onConflictDoNothing();

			if (!rowCount)
				throw exception('Conflict', ErrorCode.CannotFollowThisUser);

			await Promise.all([
				tx
					.update(users)
					.set({ followersCount: sql`${users.followersCount} + 1` })
					.where(eq(users.id, targetId)),
				tx
					.update(users)
					.set({ followingCount: sql`${users.followingCount} + 1` })
					.where(eq(users.id, userId)),
			]);
		});
	}

	public static async unfollow({
		userId,
		targetId,
	}: FollowModel.FollowOrUnfollowOptions) {
		if (userId === targetId)
			throw exception('Not Found', ErrorCode.UnknownFollow);

		await db.transaction(async (tx) => {
			const { rowCount } = await tx
				.delete(follows)
				.where(
					and(
						eq(follows.followerId, userId),
						eq(follows.followingId, targetId),
					),
				);

			if (!rowCount) throw exception('Not Found', ErrorCode.UnknownFollow);

			await Promise.all([
				tx
					.update(users)
					.set({ followersCount: sql`${users.followersCount} - 1` })
					.where(eq(users.id, targetId)),
				tx
					.update(users)
					.set({ followingCount: sql`${users.followingCount} - 1` })
					.where(eq(users.id, userId)),
			]);
		});
	}

	public static async followers({
		id,
		cursor,
	}: FollowModel.GetFollowersOptions) {
		const MAX_USERS_PER_VIEW = 10;
		const where = cursor
			? and(eq(follows.followingId, id), lt(follows.id, cursor))
			: eq(follows.followingId, id);

		const data = await db
			.select({
				id: users.id,
				name: users.name,
				avatar: users.avatar,
			})
			.from(follows)
			.innerJoin(users, eq(users.id, follows.followerId))
			.where(where)
			.orderBy(desc(follows.id))
			.limit(MAX_USERS_PER_VIEW + 1);

		const nextCursor = data[data.length - 1]?.id;

		return {
			cursor: nextCursor ? String(nextCursor) : null,
			data: data.map(({ id, name }) => ({ name, id: String(id) })),
		};
	}

	public static async following({
		id,
		cursor,
	}: FollowModel.GetFollowingOptions) {
		const MAX_USERS_PER_VIEW = 10;
		const where = cursor
			? and(eq(follows.followerId, id), lt(follows.id, cursor))
			: eq(follows.followerId, id);

		const data = await db
			.select({
				id: users.id,
				name: users.name,
				avatar: users.avatar,
			})
			.from(follows)
			.innerJoin(users, eq(users.id, follows.followingId))
			.where(where)
			.orderBy(desc(follows.id))
			.limit(MAX_USERS_PER_VIEW + 1);

		const nextCursor = data[data.length - 1]?.id;

		return {
			cursor: {
				persist: data.length > MAX_USERS_PER_VIEW,
				next: nextCursor ? String(nextCursor) : null,
			},
			data: data.map(({ id, name }) => ({ name, id: String(id) })),
		};
	}
}
