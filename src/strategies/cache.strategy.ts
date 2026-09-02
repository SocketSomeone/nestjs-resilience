import { from, Observable, of, switchMap, tap } from 'rxjs';

import { ResilienceStatesManager } from '../resilience.states-manager.js';
import { CacheOptions } from '../interfaces/index.js';
import { BaseCommand } from '../commands/index.js';
import { Strategy } from './base.strategy.js';

export class CacheStrategy extends Strategy<CacheOptions> {
	private static readonly DEFAULT_TTL = 30 * 1000;

	constructor(options: CacheOptions = CacheStrategy.DEFAULT_TTL) {
		super(options);
	}

	public process(observable: Observable<any>, command: BaseCommand, ...args): Observable<any> {
		const statesManager = ResilienceStatesManager.getInstance();
		const key = [this.name, command, JSON.stringify(args)].join('/');

		return from(statesManager.get(key)).pipe(
			switchMap(cache =>
				cache
					? of(cache)
					: observable.pipe(tap(value => statesManager.set(key, value, this.options)))
			)
		);
	}
}
