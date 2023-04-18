import { ResilienceFactory, RetryStrategy, TimeoutStrategy } from '../src';

describe('Resilience Factory', () => {
	const factory = new ResilienceFactory();

	it('should be able to create a retry strategy', () => {
		const retryStrategy = factory.createRetryStrategy({});

		expect(retryStrategy).toBeDefined();
		expect(retryStrategy).toHaveProperty('process');
		expect(retryStrategy).toBeInstanceOf(RetryStrategy);
	});

	it('should be able to create a timeout strategy', () => {
		const timeoutStrategy = factory.createStrategy(TimeoutStrategy, { timeout: 1000 });

		expect(timeoutStrategy).toBeDefined();
		expect(timeoutStrategy).toHaveProperty('process');
		expect(timeoutStrategy).toBeInstanceOf(TimeoutStrategy);
	});
});
