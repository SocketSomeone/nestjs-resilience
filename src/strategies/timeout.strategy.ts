import { Strategy } from './base.strategy';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';
import { ResilienceTimeoutException } from '../exceptions';

export interface TimeoutOptions {
	timeout?: number;
}

export class TimeoutStrategy extends Strategy<TimeoutOptions> {
	protected process<T>(observable: Observable<T>): Observable<T> {
		return observable.pipe(
			timeout(this.options.timeout),
			catchError(error => {
				if (error instanceof TimeoutError) {
					throw new ResilienceTimeoutException(this.options.timeout);
				}

				throw error;
			})
		);
	}
}
