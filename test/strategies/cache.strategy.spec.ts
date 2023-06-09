import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CacheStrategy } from '../../src';

describe('CacheStrategy', () => {
	let strategy: CacheStrategy;

	beforeEach(() => {
		strategy = new CacheStrategy();
	});

	it('should return the new value if the cache is expired', done => {
		const cachedValue = 'cached value';
		strategy['cacheItem'] = {
			value: cachedValue,
			ttl: Date.now() - 1000
		};

		const observable = strategy.process(of('new value').pipe(delay(100)), null, 'test');

		observable.subscribe(value => {
			expect(value).toBe('new value');
			done();
		});
	});

	it('should cache the new value', done => {
		const newValue = 'new value';

		const observable = strategy.process(of(newValue).pipe(delay(100)), null, 'test');

		observable.subscribe(value => {
			expect(value).toEqual(newValue);
			done();
		});
	});
});
