import { Strategy } from './strategies';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { Observable } from 'rxjs';

export function ResilienceInterceptor<T>(...strategies: Strategy[]): Type<NestInterceptor> {
	@Injectable()
	class Interceptor implements NestInterceptor {
		public intercept(
			context: ExecutionContext,
			next: CallHandler<any>
		): Observable<any> | Promise<Observable<any>> {
			let observable = next.handle();

			for (const strategy of strategies) {
				observable = strategy.process(observable);
			}

			return observable;
		}
	}

	return Interceptor;
}
