import { describe, it } from 'bun:test';
import { faker } from '@faker-js/faker';
import { SessionService } from './service';

describe('SessionController', () => {
	it('Should generate an OTP Code and create an account', async () => {
		const email = faker.internet.email();

		const { code } = await SessionService.genOTPCode({
			body: { email },
		});

		await SessionService.signUp({
			body: {
				code,
				email,
				preferences: {},
				password: faker.internet.password(),
				name: faker.person.firstName().toLowerCase(),
			},
		});
	});
});
