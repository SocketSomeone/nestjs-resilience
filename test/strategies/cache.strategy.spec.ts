import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CacheStrategy, ResilienceStatesManager } from '../../src';

describe('CacheStrategy', () => {
	let strategy: CacheStrategy, statesManager: ResilienceStatesManager;

	beforeEach(() => {
		strategy = new CacheStrategy();
		statesManager = new ResilienceStatesManager();
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
