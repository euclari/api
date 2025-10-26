import type { app } from '@/app';
import { FollowModel } from '@/modules/@me/follows/model';
import { FollowService } from '@/modules/@me/follows/service';

export const route = (elysia: typeof app) =>
	elysia.group('/users/:id', (follows) =>
		follows
			.guard({ secure: true })
			.get(
				'/followers',
				({ params: { id }, query: { cursor } }) =>
					FollowService.followers({ cursor, id: BigInt(id) }),
				{
					query: FollowModel.GET_FOLLOWERS_QUERY,
				},
			)
			.get(
				'/following',
				({ params: { id }, query: { cursor } }) =>
					FollowService.following({ cursor, id: BigInt(id) }),
				{ query: FollowModel.GET_FOLLOWERS_QUERY },
			),
	);
