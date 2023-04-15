import { RetryOptions } from '../interface';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FixedBackoff } from '../strategies';
import { Observable, retry, throwError, timer } from 'rxjs';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

export function RetryInterceptor({
	retryable = () => true,
	maxDelay = 30000,
	maxRetries = 5,
	scaleFactor = 1,
	backoff = new FixedBackoff()
}: RetryOptions = {}) {
	if (scaleFactor <= 0) {
		throw new RuntimeException('Scale factor must be greater than 0, got: ' + scaleFactor);
	}

	const strategy = typeof backoff === 'function' ? new backoff() : backoff;
	const generator = strategy.getGenerator(maxRetries);

	@Injectable()
	class Interceptor implements NestInterceptor {
		public intercept(
			context: ExecutionContext,
			next: CallHandler<any>
		): Observable<any> | Promise<Observable<any>> {
			return next.handle().pipe(
				retry({
					count: maxRetries,
					delay: (error, retryCount) => {
						if (!retryable(error, retryCount)) {
							return throwError(() => error);
						}

						const { value, done } = generator.next();

						if (done) {
							return timer(maxDelay);
						}

						return timer(Math.min(value * scaleFactor, maxDelay));
					}
				})
			);
		}
	}

	return Interceptor;
}
