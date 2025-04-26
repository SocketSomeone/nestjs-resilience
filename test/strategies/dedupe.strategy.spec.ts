import { DedupeStrategy } from '../../src';
import { lastValueFrom, map, of, switchMap, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('DedupeStrategy', () => {
	let strategy: DedupeStrategy;
	const command = null;

	beforeEach(() => {
		strategy = new DedupeStrategy();
	});

	it('should be defined', () => {
		expect(strategy).toBeDefined();
	});

	it('should create a new observable after previous one completed', async () => {
		const key = 'key-reuse';

		const first = await lastValueFrom(
			strategy.process(of('first').pipe(delay(50)), command, key)
		);
		const second = await lastValueFrom(
			strategy.process(of('second').pipe(delay(50)), command, key)
		);

		expect(first).toBe('first');
		expect(second).toBe('second');
		expect(first).not.toBe(second);
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

	it('should not share observables between different keys', async () => {
		const [first, second] = await Promise.all([
			lastValueFrom(strategy.process(of('first').pipe(delay(100)), command, 'key-1')),
			lastValueFrom(strategy.process(of('second').pipe(delay(100)), command, 'key-2'))
		]);

		expect(first).toBe('first');
		expect(second).toBe('second');
		expect(first).not.toBe(second);
	});

	it('should share the same result for parallel calls with the same key', async () => {
		const key = 'shared-key';
		const observable = of('shared-value').pipe(delay(100));

		const [first, second] = await Promise.all([
			lastValueFrom(strategy.process(observable, command, key)),
			lastValueFrom(strategy.process(observable, command, key))
		]);

		expect(first).toBe('shared-value');
		expect(second).toBe('shared-value');
		expect(first).toBe(second);
	});

	it('should propagate errors to all subscribers', async () => {
		const errorObservable = throwError(() => new Error('Boom!'));

		await expect(
			lastValueFrom(strategy.process(errorObservable, command, 'key-err'))
		).rejects.toThrow('Boom!');

		await expect(
			lastValueFrom(strategy.process(errorObservable, command, 'key-err'))
		).rejects.toThrow('Boom!');
	});

	it('should remove key from activeCommands after complete', async () => {
		const key = 'key-cleanup';

		await lastValueFrom(strategy.process(of('done').pipe(delay(50)), command, key));

		expect((strategy as any).activeCommands.has(key)).toBe(false);
	});

	it('should share the same error for parallel calls with the same key', async () => {
		const key = 'error-key';
		const errorObservable = throwError(() => new Error('Shared Boom!'));

		const promise1 = lastValueFrom(strategy.process(errorObservable, command, key)).catch(
			err => err
		);
		const promise2 = lastValueFrom(strategy.process(errorObservable, command, key)).catch(
			err => err
		);

		const [firstError, secondError] = await Promise.all([promise1, promise2]);

		expect(firstError).toBeInstanceOf(Error);
		expect(secondError).toBeInstanceOf(Error);
		expect(firstError.message).toBe('Shared Boom!');
		expect(secondError.message).toBe('Shared Boom!');
	});

	it('should not mix results between different keys even on errors', async () => {
		const goodKey = 'good-key';
		const badKey = 'bad-key';

		const goodObservable = of('success').pipe(delay(100));
		const badObservable = throwError(() => new Error('Failure'));

		const goodResult = lastValueFrom(strategy.process(goodObservable, command, goodKey));
		const badResult = lastValueFrom(strategy.process(badObservable, command, badKey)).catch(
			err => err
		);

		const [success, failure] = await Promise.all([goodResult, badResult]);

		expect(success).toBe('success');
		expect(failure).toBeInstanceOf(Error);
		expect(failure.message).toBe('Failure');
	});
});
