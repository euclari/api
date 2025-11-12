import { parse } from 'useragent';

interface IdentifyOptions {
	ip?: string;
	header?: string;
}

export const identify = async ({ ip, header }: IdentifyOptions = {}) => {
	if (!header) return;

	const agent = parse(header);
	const device = agent.device.toString();

	const data = {
		agent: agent.toAgent(),
		device: device !== 'Other 0.0.0' ? device : agent.os.toString(),
	} as Record<string, string>;

	if (ip) {
		data.ip = ip;

		try {
			const response = await fetch(`https://ipapi.co/${ip}/json`, {
				signal: AbortSignal.timeout(3000),
			});

			if (response.ok) {
				const { city, region } = await response.json();

				data.city = city;
				data.region = region;
			}
		} catch {}
	}

	return data;
};
