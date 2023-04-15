import { TimeoutOptions } from '../interface';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, timeout } from 'rxjs';

export function TimeoutInterceptor({ timeout: value = 1000 }: TimeoutOptions) {
	@Injectable()
	class Interceptor implements NestInterceptor {
		public intercept(
			context: ExecutionContext,
			next: CallHandler<any>
		): Observable<any> | Promise<Observable<any>> {
			return next.handle().pipe(timeout(value));
		}
	}

	return Interceptor;
}
