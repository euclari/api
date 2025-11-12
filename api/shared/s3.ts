import { randomBytes } from 'node:crypto';
import { sign } from 'aws4';
import { env } from '@/env';

interface CreatePresignedURLOptions {
	bucket: string;
	expires?: number;
	key: string | bigint;
}

export const s3 = {
	sign({ key, bucket, expires = 15 }: CreatePresignedURLOptions) {
		const hash = randomBytes(16).toHex();
		const { host, protocol } = new URL(env.MINIO_ENDPOINT);

		const { path } = sign(
			{
				host,
				method: 'PUT',
				service: 's3',
				signQuery: true,
				path: `/${bucket}/${key}/${hash}.webp?X-Amz-Expires=${expires}`,
			},
			{
				accessKeyId: env.MINIO_ACCESS_KEY_ID,
				secretAccessKey: env.MINIO_SECRET_ACCESS_KEY,
			},
		);

		return {
			hash,
			route: `${protocol}//${host}${path}`,
		};
	},
	async delete({ key, bucket }: Omit<CreatePresignedURLOptions, 'expires'>) {
		const { host, protocol } = new URL(env.MINIO_ENDPOINT);

		const { headers } = sign(
			{
				host,
				service: 's3',
				method: 'DELETE',
				path: `/${bucket}/${key}.webp`,
			},
			{
				accessKeyId: env.MINIO_ACCESS_KEY_ID,
				secretAccessKey: env.MINIO_SECRET_ACCESS_KEY,
			},
		);

		const { ok } = await fetch(`${protocol}//${host}/${bucket}/${key}`, {
			// @ts-expect-error
			headers,
			method: 'DELETE',
		});

		return ok;
	},
};
