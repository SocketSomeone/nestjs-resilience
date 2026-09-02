import { FallbackOptions } from './fallback-options.interface.js';
import { TimeoutOptions } from './timeout-options.interface.js';
import { CacheOptions } from './cache-options.interface.js';

export interface CircuitBreakerOptions {
	requestVolumeThreshold?: number;
	sleepWindowInMilliseconds?: number;
	rollingWindowInMilliseconds?: number;
	errorThresholdPercentage?: number;
	timeoutInMilliseconds?: TimeoutOptions;
	cachedTimeoutInMilliseconds?: CacheOptions;
	fallback?: FallbackOptions;
}
