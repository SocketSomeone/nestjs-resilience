import { FixedBackoff, RetryStrategy, TimeoutStrategy, UseResilience } from '../../src';

const timeoutStrategy = new TimeoutStrategy({ timeout: 100 });
const retryStrategy = new RetryStrategy({
	maxRetries: 3,
	backoff: FixedBackoff
});

const spyOnRetry = jest.spyOn(FixedBackoff.prototype, 'getGenerator');

class UserService {
	@UseResilience(timeoutStrategy)
	async getUser(id: string) {
		return { id, name: 'John Doe' };
	}

	private usersCalls = 0;

	@UseResilience(timeoutStrategy, retryStrategy)
	async getUsers() {
		if (this.usersCalls === 0) {
			this.usersCalls += 1;
			throw new Error('Error');
		}

		if (this.usersCalls === 1) {
			this.usersCalls += 1;

			setTimeout(() => {
				Promise.resolve();
			}, 1000);
		}

		return [{ id: '1', name: 'John Doe' }];
	}
}

describe('Resilience Decorator', () => {
	const userService = new UserService();

	it('should be able to execute a command', async () => {
		const value = await userService.getUser('1');

		expect(value).toEqual({
			id: '1',
			name: 'John Doe'
		});
	});

	it('should be able get error', done => {
		userService.getUsers().then(value => {
			expect(value).toEqual([{ id: '1', name: 'John Doe' }]);
			done();
		});
	});
});
