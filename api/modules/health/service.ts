import { loadavg, uptime } from 'node:os';
import { db } from '@/db';
import { env } from '@/env';
import type { HealthModel } from './model';

export abstract class HealthService {
	public static async get({ since, requests }: HealthModel.GetOptions) {
		const { count } = HealthService;
		const memory = process.memoryUsage();

		const [redis, database] = await Promise.all([
			count(Bun.redis.ping()),
			count(db.execute('SELECT 1')),
		]);

		return {
			since,
			counters: {
				requests,
			},
			env: env.NODE_ENV,
			uptime: Date.now() - since,
			resources: {
				redis,
				database,
				cpu: {
					load: loadavg()[0],
					uptimeSec: uptime(),
				},
				memory: {
					rss: memory.rss,
					heapUsed: memory.heapUsed,
					heapTotal: memory.heapTotal,
				},
			},
			commit: env.GIT_COMMIT ?? null,
		};
	}

	protected static async count(promise: Promise<unknown>) {
		const start = performance.now();

		await promise;

		return {
			start,
			total: performance.now() - start,
		};
	}
}
