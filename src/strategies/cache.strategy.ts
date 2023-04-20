import { Strategy } from './base.strategy';
import { Observable, of, tap } from 'rxjs';
import { CacheOptions } from '../interfaces';

interface CacheItem {
	value: any;
	ttl: number;
}

export class CacheStrategy extends Strategy<CacheOptions> {
	private static readonly DEFAULT_TTL = 30 * 1000;

	private readonly cache: Map<string, CacheItem> = new Map();

	constructor(options: CacheOptions = CacheStrategy.DEFAULT_TTL) {
		super(options);
	}

	public process(observable: Observable<any>, ...args): Observable<any> {
		const key = JSON.stringify(args);

		if (this.cache.has(key)) {
			const cacheItem = this.cache.get(key);

			if (cacheItem.ttl > Date.now()) {
				return of(cacheItem.value);
			}
		}

		return observable.pipe(
			tap(value => {
				this.cache.set(key, {
					value,
					ttl: Date.now() + this.options
				});
			})
		);
	}
}
