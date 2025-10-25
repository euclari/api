import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { ErrorCode, exception } from '@/shared/errors';
import type { ConnectionModel } from './model';

export abstract class ConnectionService {
	/* public static async connect({
		id,
		provider,
	}: ConnectionModel.ConnectOptions) {} */

	public static async remove({
		id,
		connection,
	}: ConnectionModel.RemoveOptions) {
		const { rowCount } = await db.execute(sql`
            UPDATE users
            SET connections = (
                SELECT jsonb_agg(item)
                FROM jsonb_array_elements(connections) AS item
                WHERE item->>'id' <> '${connection}'
            )
            WHERE id = ${id};
        `);

		if (!rowCount) throw exception('Not Found', ErrorCode.UnknownConnection);
	}
}
