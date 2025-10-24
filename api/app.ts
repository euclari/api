import { createApp } from '@/client';
import { routify } from '@/client/shared/routify';
import { env } from '@/env';

export const app = createApp();

await routify(app);

app.listen(env.PORT, ({ port, hostname }) => {
	console.log(`${env.APP_NAME} is ready at ${hostname}:${port}`);
});
