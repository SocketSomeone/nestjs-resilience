import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	RequestTimeoutException,
	Type
} from '@nestjs/common';
import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs';
import { TimeoutOptions } from '../strategies';

export function TimeoutInterceptor({
	timeout: value = 1000
}: TimeoutOptions): Type<NestInterceptor> {
	@Injectable()
	class Interceptor implements NestInterceptor {
		public intercept(
			context: ExecutionContext,
			next: CallHandler<any>
		): Observable<any> | Promise<Observable<any>> {
			return next.handle().pipe(
				timeout(value),
				catchError(err => {
					if (err instanceof TimeoutError) {
						return throwError(() => new RequestTimeoutException());
					}

					return throwError(() => err);
				})
			);
		}
	}

	return Interceptor;
}
