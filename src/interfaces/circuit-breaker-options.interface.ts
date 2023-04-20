import { TimeoutOptions } from './timeout-options.interface';
import { CacheOptions } from './cache-options.interface';
import { FallbackOptions } from './fallback-options.interface';

export interface CircuitBreakerOptions {
	requestVolumeThreshold?: number;
	sleepWindowInMilliseconds?: number;
	errorThresholdPercentage?: number;
	timeoutInMilliseconds?: TimeoutOptions;
	cachedTimeoutInMilliseconds?: CacheOptions;
	fallback?: FallbackOptions;
}
