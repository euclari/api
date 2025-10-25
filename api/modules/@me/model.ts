import { t } from 'elysia';

export namespace UserModel {
	export interface GetOptions {
		id: bigint;
	}

	export const UPDATE_SCHEMA = t.Partial(
		t.Object({
			font: t.Object({
				name: t.Optional(t.UnionEnum(['...'])),
				size: t.Optional(t.Integer({ minimum: 1, maximum: 5 })),
			}),
			private: t.Nullable(t.Literal(true)),
			locale: t.UnionEnum(['fr', 'de', 'en', 'pt', 'es']),
			birthday: t.Date({ maximumTimestamp: Date.parse('2020') }),
			pronouns: t.String({ minLength: 3, maxLength: 15 }),
			bio: t.String({ minLength: 15, maxLength: 256 }),
		}),
	);

	export interface UpdateOptions extends GetOptions {
		body: typeof UPDATE_SCHEMA.static;
	}
}
