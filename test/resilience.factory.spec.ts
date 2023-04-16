import { ResilienceFactory, RetryStrategy, TimeoutStrategy } from '../src';

describe('Resilience Factory', () => {
	const factory = new ResilienceFactory();

	it('should be able to create a retry strategy', () => {
		const retryStrategy = factory.createRetryStrategy({});

		expect(retryStrategy).toBeDefined();
		expect(retryStrategy).toHaveProperty('execute');
		expect(retryStrategy).toBeInstanceOf(RetryStrategy);
	});

	it('should be able to create a timeout strategy', () => {
		const timeoutStrategy = factory.createStrategy(TimeoutStrategy, {});

		expect(timeoutStrategy).toBeDefined();
		expect(timeoutStrategy).toHaveProperty('execute');
		expect(timeoutStrategy).toBeInstanceOf(TimeoutStrategy);
	});
});
