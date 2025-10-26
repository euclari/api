import type { app } from '@/app';
import { FollowService } from './service';

export const route = (elysia: typeof app) =>
	elysia.group('/users/@me/follows/:id', (follows) =>
		follows
			.guard({ secure: true, tags: ['@me'] })
			.post('', ({ params: { id }, user: { id: userId } }) =>
				FollowService.follow({ userId, targetId: BigInt(id) }),
			)
			.delete('', ({ params: { id }, user: { id: userId } }) =>
				FollowService.unfollow({ userId, targetId: BigInt(id) }),
			),
	);
