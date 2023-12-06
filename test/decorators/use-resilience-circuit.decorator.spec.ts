import { CircuitBreakerStrategy, UseResilience } from '../../src';

class UserService {
	async queryUser(id: string) {
		return { id, name: 'John Doe' };
	}

	@UseResilience(
		new CircuitBreakerStrategy({
			requestVolumeThreshold: 3,
			rollingWindowInMilliseconds: 1000
		})
	)
	async getUser(id: string) {
		return await this.queryUser(id);
	}
}

jest.useFakeTimers({ advanceTimers: true });

describe('Resilience Decorator', () => {
	const userService = new UserService();

	beforeEach(async () => {
		await jest.advanceTimersByTimeAsync(10000);
		jest.restoreAllMocks();
	});

	it('should propagate an error', async () => {
		jest.spyOn(userService, 'queryUser').mockRejectedValueOnce(new Error('err'));

		await expect(async () => await userService.getUser('1')).rejects.toThrow(new Error('err'));
	});

	it('should open the circuit and throw a circuit opened error', async () => {
		jest.spyOn(userService, 'queryUser').mockRejectedValue(new Error('err'));

		// Execute multiple calls to trigger circuit opening
		await expect(async () => await userService.getUser('1')).rejects.toThrow(new Error('err')); // 1st call. 20% failures
		await expect(async () => await userService.getUser('1')).rejects.toThrow(new Error('err')); // 2nd call. 40% failures
		await expect(async () => await userService.getUser('1')).rejects.toThrow(new Error('err')); // 3rd call. 60% failures

		// Circuit should be open now, expect CircuitOpenedException
		await expect(async () => await userService.getUser('1')).rejects.toThrow(
			new Error('Circuit is open')
		);
	});

	it('should be able to execute a command', async () => {
		const value = await userService.getUser('1');

		expect(value).toEqual({
			id: '1',
			name: 'John Doe'
		});
	});
});
