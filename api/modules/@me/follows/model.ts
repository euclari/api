import { t } from 'elysia';

export namespace FollowModel {
	export interface FollowOrUnfollowOptions {
		userId: bigint;
		targetId: bigint;
	}

	export interface GetFollowersOptions {
		id: bigint;
		cursor?: bigint;
	}

	export type GetFollowingOptions = GetFollowersOptions;

	export const GET_FOLLOWERS_QUERY = t.Object({
		cursor: t.Optional(t.Transform(t.String()).Decode(BigInt).Encode(String)),
	});

	export const GET_FOLLOWING_QUERY = t.Object(GET_FOLLOWERS_QUERY.properties);
}
