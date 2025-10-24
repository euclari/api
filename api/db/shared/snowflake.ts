import { hostname } from 'node:os';
import { bigint } from 'drizzle-orm/pg-core';

const workerBits = 10n;
const sequenceBits = 12n;
const EPOCH = 1759276800000n; // 1 de outubro de 2025 UTC

const TEN_BITS = 0x3ff;
const maxSequence = (1n << sequenceBits) - 1n;

const workerId = BigInt(
	(hostname()
		.split('')
		.reduce((acc, c) => acc + c.charCodeAt(0), 0) +
		process.pid) &
		TEN_BITS,
);

let sequence = 0n;
let lastTimestamp = 0n;

export const genSnow = () => {
	let timestamp = BigInt(Date.now());

	if (timestamp === lastTimestamp) {
		sequence = (sequence + 1n) & maxSequence;

		if (sequence === 0n) timestamp = lastTimestamp + 1n;
	} else sequence = 0n;

	lastTimestamp = timestamp;

	return (
		((timestamp - EPOCH) << (workerBits + sequenceBits)) |
		(workerId << sequenceBits) |
		sequence
	);
};

export const getSnowCreation = (snowflake: bigint) => {
	return Number((snowflake >> (workerBits + sequenceBits)) + EPOCH);
};

export const snowflake = ({ type }: { type: 'primary' | 'foreign' }) => {
	const snow = bigint({ mode: 'bigint' }).$defaultFn(genSnow);

	return type === 'foreign' ? snow.notNull() : snow.primaryKey();
};
