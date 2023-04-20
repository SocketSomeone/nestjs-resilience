import { Strategy } from './base.strategy';
import { Observable, throwError } from 'rxjs';
import { ThrottlerException } from '../exceptions';
import { ThrottleOptions } from '../interfaces';

export class ThrottleStrategy extends Strategy<ThrottleOptions> {
	private static readonly DEFAULT_OPTIONS: ThrottleOptions = {
		ttl: 1000,
		limit: 10
	};

	private records: number[] = [];

	public constructor(options?: ThrottleOptions) {
		super({ ...ThrottleStrategy.DEFAULT_OPTIONS, ...options });

		if (this.options.ttl <= 0) {
			throw new RangeError('TTL must be greater than 0, got: ' + this.options.ttl);
		}

		if (this.options.limit <= 0) {
			throw new RangeError('Limit must be greater than 0, got: ' + this.options.limit);
		}
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		const now = Date.now();
		const expired = now - this.options.ttl;

		this.records = this.records.filter(record => record > expired);

		if (this.isLimitReached) {
			return throwError(() => new ThrottlerException());
		}

		this.records.push(now);

		return observable;
	}

	public get isLimitReached(): boolean {
		return this.records.length >= this.options.limit;
	}
}
