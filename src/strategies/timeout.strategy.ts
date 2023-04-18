import { Strategy } from './base.strategy';
import { Observable, throwError, timeout } from 'rxjs';
import { TimeoutException } from '../exceptions';

export interface TimeoutOptions {
	timeout?: number;
}

export class TimeoutStrategy extends Strategy<TimeoutOptions> {
	private static readonly DEFAULT_OPTIONS: TimeoutOptions = {
		timeout: 1000
	};

	public constructor(options?: TimeoutOptions) {
		super({ ...TimeoutStrategy.DEFAULT_OPTIONS, ...options });

		if (this.options.timeout <= 0) {
			throw new RangeError('Timeout must be greater than 0, got: ' + this.options.timeout);
		}
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		return observable.pipe(
			timeout({
				each: this.options.timeout,
				with: () => throwError(() => new TimeoutException(this.options.timeout))
			})
		);
	}
}
