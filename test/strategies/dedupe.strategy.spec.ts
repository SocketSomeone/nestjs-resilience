import { DedupeStrategy } from '../../src';
import { lastValueFrom, map, of, switchMap, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('DedupeStrategy', () => {
	let strategy: DedupeStrategy;
	const command = null;
	const observable = of('value').pipe(map(value => `${value}-${Date.now()}`));

	beforeEach(() => {
		strategy = new DedupeStrategy();
	});

	it('should be defined', () => {
		expect(strategy).toBeDefined();
	});

	it('should process observable and return the same value', async () => {
		const data = [
			{ key: 'k-1', timeout: 500 },
			{ key: 'k-1', timeout: 300 },
			{ key: 'k-2', timeout: 300 }
		];

		const [first, second, third] = await Promise.all(
			data.map(({ key, timeout }) =>
				lastValueFrom(strategy.process(observable.pipe(delay(timeout)), command, key))
			)
		);

		expect(first).toBe(second);
		expect(first).not.toBe(third);
	});

	it('should process error observable and return the same error', async () => {
		const observable = of('value').pipe(map(value => `${value}-${Date.now()}`));
		const data = [
			{ key: 'k-1', timeout: 500, error: true },
			{ key: 'k-1', timeout: 300, error: false },
			{ key: 'k-2', timeout: 300, error: true }
		];

		const [first, second, third] = await Promise.all(
			data.map(async ({ key, timeout, error }) => {
				const body = error
					? switchMap(() => {
							return throwError(() => new Error());
						})
					: map(value => value);

				const obs = observable.pipe(delay(timeout), body);

				return lastValueFrom(strategy.process(obs, command, key)).catch(err => err);
			})
		);

		expect(first).toBe(second);
		expect(first).toBeInstanceOf(Error);
		expect(first).not.toBe(third);

		expect(second).not.toBe(third);
		expect(second).toBeInstanceOf(Error);

		expect(third).toBeInstanceOf(Error);
	});
});
