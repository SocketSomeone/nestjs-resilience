import { CircuitBreakerStatus, CircuitBreakerStrategy, ResilienceStatesManager } from '../../src';
import { of, throwError } from 'rxjs';

describe('CircuitBreakerStrategy', () => {
	let strategy: CircuitBreakerStrategy, statesManager: ResilienceStatesManager;

	beforeEach(() => {
		strategy = new CircuitBreakerStrategy({
			requestVolumeThreshold: 1,
			sleepWindowInMilliseconds: 1000,
			fallback: () => 'fallback'
		});

		statesManager = new ResilienceStatesManager();
	});

	afterEach(async () => {
		await statesManager.reset();
	});

	const isState = (status: CircuitBreakerStatus) => {
		const key = [strategy['name'], null].join('/');
		return statesManager
			.get<any>(key)
			.then(state => state.status === status)
			.catch(() => false);
	};

	const isOpen = () => isState(CircuitBreakerStatus.Open);
	const isHalfOpen = () => isState(CircuitBreakerStatus.HalfOpen);
	const isClosed = () => isState(CircuitBreakerStatus.Closed);

	it('should be able to create an instance', () => {
		expect(strategy).toBeTruthy();
	});

	it('should short-circuit', async () => {
		const observable = throwError(new Error('test'));

		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual('fallback');
		await expect(isOpen()).resolves.toBeTruthy();
	});

	it('should reset after sleepWindowInMilliseconds', async () => {
		const observable = throwError(new Error('test'));

		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual('fallback');
		await expect(isOpen()).resolves.toBeTruthy();

		await new Promise(resolve => setTimeout(resolve, 1000));

		await expect(strategy.process(of(1), null).toPromise()).resolves.toEqual(1);
		await expect(isClosed()).resolves.toBeTruthy();
	});

	it('should not short-circuit', async () => {
		const observable = of(1);

		await expect(strategy.process(observable, null).toPromise()).resolves.toEqual(1);
		await expect(isClosed()).resolves.toBeTruthy();
	});
});
