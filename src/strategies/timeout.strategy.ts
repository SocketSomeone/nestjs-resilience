import { Observable, throwError, timeout } from 'rxjs';

import { TimeoutException } from '../exceptions/index.js';
import { TimeoutOptions } from '../interfaces/index.js';
import { Strategy } from './base.strategy.js';

export class TimeoutStrategy extends Strategy<TimeoutOptions> {
	private static readonly DEFAULT_OPTIONS: TimeoutOptions = 1000;

	public constructor(options: TimeoutOptions = TimeoutStrategy.DEFAULT_OPTIONS) {
		super(options);

		if (this.options <= 0) {
			throw new RangeError('Timeout must be greater than 0, got: ' + this.options);
		}
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		return observable.pipe(
			timeout({
				each: this.options,
				with: () => throwError(() => new TimeoutException(this.options))
			})
		);
	}
}
