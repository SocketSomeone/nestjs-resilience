import { Strategy } from './base.strategy';
import { from, Observable, switchMap, throwError } from 'rxjs';
import { ThrottlerException } from '../exceptions';
import { ThrottleOptions } from '../interfaces';
import { ResilienceStatesManager } from '../resilience.states-manager';
import { BaseCommand } from '../commands';

export class ThrottleStrategy extends Strategy<ThrottleOptions> {
	private static readonly DEFAULT_OPTIONS: ThrottleOptions = {
		ttl: 1000,
		limit: 10
	};

	public constructor(options?: ThrottleOptions) {
		super({ ...ThrottleStrategy.DEFAULT_OPTIONS, ...options });

		if (this.options.ttl <= 0) {
			throw new RangeError('TTL must be greater than 0, got: ' + this.options.ttl);
		}

		if (this.options.limit <= 0) {
			throw new RangeError('Limit must be greater than 0, got: ' + this.options.limit);
		}
	}

	public process<T>(observable: Observable<T>, command: BaseCommand): Observable<T> {
		const cacheManager = ResilienceStatesManager.getInstance();

		const now = Date.now();
		const expired = now - this.options.ttl;

		const key = [this.name, command].join('/');
		const records$ = from(cacheManager.wrap<number[]>(key, async () => [], this.options.ttl));

		return records$.pipe(
			switchMap(records => {
				records = records.filter(record => record >= expired);

				if (records.length >= this.options.limit) {
					return throwError(() => new ThrottlerException());
				}

				records = [...records, now];

				return from(cacheManager.set(key, records)).pipe(switchMap(() => observable));
			})
		);
	}
}
