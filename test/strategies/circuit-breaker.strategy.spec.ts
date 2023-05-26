import { CircuitBreakerStrategy } from '../../src';
import { of, throwError } from 'rxjs';

describe('CircuitBreakerStrategy', () => {
	let strategy: CircuitBreakerStrategy;

	beforeEach(() => {
		strategy = new CircuitBreakerStrategy({
			requestVolumeThreshold: 1,
			sleepWindowInMilliseconds: 1000,
			fallback: () => 'fallback'
		});
	});

	it('should be able to create an instance', () => {
		expect(strategy).toBeTruthy();
	});

	it('should short-circuit', async () => {
		const observable = throwError(new Error('test'));

		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual('fallback');
		expect(strategy['isOpen']).toBeTruthy();
		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual('fallback');
	});

	it('should reset after sleepWindowInMilliseconds', async () => {
		const observable = throwError(new Error('test'));

		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual('fallback');
		expect(strategy['isOpen']).toBeTruthy();
		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual('fallback');

		await new Promise(resolve => setTimeout(resolve, 1000));

		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual('fallback');
		expect(strategy['isOpen']).toBeTruthy();

		await new Promise(resolve => setTimeout(resolve, 1000));

		await expect(strategy.process(of(1), null).toPromise()).resolves.toEqual(1);
		expect(strategy['isClosed']).toBeTruthy();
	});

	it('should not short-circuit', async () => {
		const observable = of(1);

		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual(1);
		expect(strategy['isClosed']).toBeTruthy();
		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual(1);
	});
});
