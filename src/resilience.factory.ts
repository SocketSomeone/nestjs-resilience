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
	public static createBulkheadStrategy(options: BulkheadOptions) {
		return this.createStrategy(BulkheadStrategy, options);
	}

	public static createCacheStrategy(options: CacheOptions) {
		return this.createStrategy(CacheStrategy, options);
	}

	public static createCircuitBreakerStrategy(options: CircuitBreakerOptions) {
		return this.createStrategy(CircuitBreakerStrategy, options);
	}

	public static createFallbackStrategy(options: FallbackOptions) {
		return this.createStrategy(FallbackStrategy, options);
	}

	public static createHealthCheckStrategy(options: HealthCheckOptions) {
		return this.createStrategy(HealthCheckStrategy, options);
	}

	public static createRetryStrategy(options: RetryOptions) {
		return this.createStrategy(RetryStrategy, options);
	}

	public static createThrottleStrategy(options: ThrottleOptions) {
		return this.createStrategy(ThrottleStrategy, options);
	}

	public static createTimeoutStrategy(options: TimeoutOptions) {
		return this.createStrategy(TimeoutStrategy, options);
	}

	public static createStrategy<T>(strategy: Type<Strategy<T>>, options: T) {
		return new strategy(options);
	}

	public static createCommand<T>(command: Type<T>, strategies: Strategy[]) {
		return new command(strategies);
	}

	public createBulkheadStrategy(options: BulkheadOptions) {
		return ResilienceFactory.createStrategy(BulkheadStrategy, options);
	}

	public createCacheStrategy(options: CacheOptions) {
		return ResilienceFactory.createStrategy(CacheStrategy, options);
	}

	public createCircuitBreakerStrategy(options: CircuitBreakerOptions) {
		return ResilienceFactory.createStrategy(CircuitBreakerStrategy, options);
	}

	public createFallbackStrategy(options: FallbackOptions) {
		return ResilienceFactory.createStrategy(FallbackStrategy, options);
	}

	public createHealthCheckStrategy(options: HealthCheckOptions) {
		return ResilienceFactory.createStrategy(HealthCheckStrategy, options);
	}

	public createRetryStrategy(options: RetryOptions) {
		return ResilienceFactory.createStrategy(RetryStrategy, options);
	}

	public createThrottleStrategy(options: ThrottleOptions) {
		return ResilienceFactory.createStrategy(ThrottleStrategy, options);
	}

	public createTimeoutStrategy(options: TimeoutOptions) {
		return ResilienceFactory.createStrategy(TimeoutStrategy, options);
	}

	public createStrategy<T>(strategy: Type<Strategy<T>>, options: T) {
		return ResilienceFactory.createStrategy(strategy, options);
	}

	public createCommand<T>(command: Type<T>, strategies: Strategy[]) {
		return ResilienceFactory.createCommand(command, strategies);
	}
}
