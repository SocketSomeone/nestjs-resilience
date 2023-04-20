import { Injectable, Type } from '@nestjs/common';
import {
	BulkheadStrategy,
	CacheStrategy,
	CircuitBreakerStrategy,
	FallbackStrategy,
	HealthCheckStrategy,
	RetryStrategy,
	Strategy,
	ThrottleStrategy,
	TimeoutStrategy
} from './strategies';
import {
	BulkheadOptions,
	CacheOptions,
	CircuitBreakerOptions,
	FallbackOptions,
	HealthCheckOptions,
	RetryOptions,
	ThrottleOptions,
	TimeoutOptions
} from './interfaces';

@Injectable()
export class ResilienceFactory {
	public createBulkheadStrategy(options: BulkheadOptions) {
		return this.createStrategy(BulkheadStrategy, options);
	}

	public createCacheStrategy(options: CacheOptions) {
		return this.createStrategy(CacheStrategy, options);
	}

	public createCircuitBreakerStrategy(options: CircuitBreakerOptions) {
		return this.createStrategy(CircuitBreakerStrategy, options);
	}

	public createFallbackStrategy(options: FallbackOptions) {
		return this.createStrategy(FallbackStrategy, options);
	}

	public createHealthCheckStrategy(options: HealthCheckOptions) {
		return this.createStrategy(HealthCheckStrategy, options);
	}

	public createRetryStrategy(options: RetryOptions) {
		return this.createStrategy(RetryStrategy, options);
	}

	public createThrottleStrategy(options: ThrottleOptions) {
		return this.createStrategy(ThrottleStrategy, options);
	}

	public createTimeoutStrategy(options: TimeoutOptions) {
		return this.createStrategy(TimeoutStrategy, options);
	}

	public createStrategy<T>(strategy: Type<Strategy<T>>, options: T) {
		return new strategy(options);
	}

	public createCommand<T>(command: Type<T>, strategies: Strategy[]) {
		return new command(strategies);
	}
}
