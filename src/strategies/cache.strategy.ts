import { Strategy } from './base.strategy';
import { Observable, of, tap } from 'rxjs';

export type CacheOptions = number;

interface CacheItem {
	value: any;
	ttl: number;
}

export class CacheStrategy extends Strategy<CacheOptions> {
	private static readonly DEFAULT_TTL = 30 * 1000;

	private cacheItem: CacheItem = null;

	constructor(options: CacheOptions = CacheStrategy.DEFAULT_TTL) {
		super(options);
	}

	public process(observable: Observable<any>): Observable<any> {
		if (this.cacheItem && this.cacheItem.ttl > Date.now()) {
			return of(this.cacheItem.value);
		}

		return observable.pipe(
			tap(value => {
				this.cacheItem = { value, ttl: Date.now() + this.options };
			})
		);
	}
}
