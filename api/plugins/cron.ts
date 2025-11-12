import { cron as createCron, Patterns } from '@elysiajs/cron';
import { SessionService } from '@/modules/sessions/service';

export const cron = createCron({
	catch: true,
	name: 'cron',
	async run() {
		const count = await SessionService.sweep({});

		console.log(`\n[DEBUG]: ${count} sessions removed (expired)`);
	},
	pattern: Patterns.EVERY_HOUR,
});
