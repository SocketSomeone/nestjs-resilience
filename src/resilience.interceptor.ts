import {
	BulkheadStrategy,
	CacheStrategy,
	CircuitBreakerStrategy,
	FallbackStrategy,
	RetryStrategy,
	Strategy,
	ThrottleStrategy,
	TimeoutStrategy
} from './strategies';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { ResilienceFactory } from './resilience.factory';
import { Observable } from 'rxjs';
import {
	BulkheadOptions,
	CacheOptions,
	CircuitBreakerOptions,
	FallbackOptions,
	RetryOptions,
	ThrottleOptions,
	TimeoutOptions
} from './interfaces';

export function ResilienceInterceptor<T>(
	strategy: Type<Strategy<T>>,
	options: T
): Type<NestInterceptor> {
	@Injectable()
	class Interceptor implements NestInterceptor {
		private readonly strategy = this.factory.createStrategy(strategy, options);

		public constructor(private readonly factory: ResilienceFactory) {}

		public intercept(
			context: ExecutionContext,
			next: CallHandler<any>
		): Observable<any> | Promise<Observable<any>> {
			return this.strategy.process(next.handle(), null);
		}
	}

	return Interceptor;
}

export const BulkheadInterceptor = (options: BulkheadOptions) =>
	ResilienceInterceptor(BulkheadStrategy, options);

export const CacheInterceptor = (options: CacheOptions) =>
	ResilienceInterceptor(CacheStrategy, options);

export const CircuitBreakerInterceptor = (options: CircuitBreakerOptions) =>
	ResilienceInterceptor(CircuitBreakerStrategy, options);

export const FallbackInterceptor = (options: FallbackOptions) =>
	ResilienceInterceptor(FallbackStrategy, options);

export const HealthCheckInterceptor = (options: BulkheadOptions) =>
	ResilienceInterceptor(BulkheadStrategy, options);

export const RetryInterceptor = (options: RetryOptions) =>
	ResilienceInterceptor(RetryStrategy, options);

export const ThrottleInterceptor = (options: ThrottleOptions) =>
	ResilienceInterceptor(ThrottleStrategy, options);

export const TimeoutInterceptor = (options: TimeoutOptions) =>
	ResilienceInterceptor(TimeoutStrategy, options);
