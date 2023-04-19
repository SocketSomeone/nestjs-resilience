import { Injectable, Logger, Type } from '@nestjs/common';
import {
	BulkheadOptions,
	BulkheadStrategy,
	FallbackOptions,
	FallbackStrategy,
	HealthCheckOptions,
	HealthCheckStrategy,
	RetryOptions,
	RetryStrategy,
	Strategy,
	ThrottleOptions,
	ThrottleStrategy,
	TimeoutOptions,
	TimeoutStrategy
} from './strategies';

@Injectable()
export class ResilienceFactory {
	private readonly logger = new Logger(ResilienceFactory.name);

	public createBulkheadStrategy(options: BulkheadOptions) {
		return this.createStrategy(BulkheadStrategy, options);
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
}
