import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RetryOptions, RetryStrategy } from '../strategies/retry.strategy';

export function RetryInterceptor(options: RetryOptions = {}): Type<NestInterceptor> {
	const strategy = new RetryStrategy(options);

	@Injectable()
	class Interceptor implements NestInterceptor {
		public intercept(
			context: ExecutionContext,
			next: CallHandler<any>
		): Observable<any> | Promise<Observable<any>> {
			return strategy.execute(next.handle());
		}
	}

	return Interceptor;
}
