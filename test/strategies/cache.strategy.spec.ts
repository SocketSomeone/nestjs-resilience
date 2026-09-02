import { delay } from 'rxjs/operators';
import { of } from 'rxjs';

import { CacheStrategy, ResilienceStatesManager } from '../../src/index.js';

describe('CacheStrategy', () => {
	let strategy: CacheStrategy;

	beforeEach(() => {
		strategy = new CacheStrategy();
		new ResilienceStatesManager();
	});

	it('should cache the new value', () => {
		const newValue = 'new value';

		const observable = strategy.process(of(newValue).pipe(delay(100)), null!, 'test');

		return new Promise<void>(resolve => {
			observable.subscribe(value => {
				expect(value).toEqual(newValue);
				resolve();
			});
		});
	});
});
