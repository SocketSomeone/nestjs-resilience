import { Strategy } from './base.strategy';
import { Observable, throwError, timeout } from 'rxjs';
import { ResilienceTimeoutException } from '../exceptions';

export interface TimeoutOptions {
	timeout: number;
}

export class TimeoutStrategy extends Strategy<TimeoutOptions> {
	public process<T>(observable: Observable<T>): Observable<T> {
		return observable.pipe(
			timeout({
				each: this.options.timeout,
				with: () => throwError(() => new ResilienceTimeoutException(this.options.timeout))
			})
		);
	}
}
