import type { AnyElysia } from 'elysia';

export const routify = async (app: AnyElysia) => {
	const children = new Bun.Glob('api/modules/**/index.ts').scan({
		absolute: true,
	});

	for await (const path of children) {
		const { route } = await import(path);

		if (!route)
			throw new Error(`Expected an exported route() method at "${path}"`);

		route(app);
	}
};
