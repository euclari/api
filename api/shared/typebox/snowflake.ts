import { t } from 'elysia';

export const Snowflake = t.Transform(t.String()).Decode(BigInt).Encode(String);
