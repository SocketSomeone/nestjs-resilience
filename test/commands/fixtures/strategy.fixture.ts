import { FixedBackoff, RetryStrategy } from '../../../src';

export const retryStrategy = new RetryStrategy({
	maxRetries: 5,
	maxDelay: 30000,
	scaleFactor: 1,
	backoff: FixedBackoff,
	retryable: () => true
});
