import { FixedBackoff, RetryStrategy } from '../../src';
import { of, tap } from 'rxjs';

describe('Retry Strategy', () => {
	const strategy = new RetryStrategy({
		maxRetries: 5,
		maxDelay: 30000,
		scaleFactor: 1,
		backoff: FixedBackoff,
		retryable: () => true
	});

	it('should exceed retry limit', async () => {
		const clone = strategy.clone();
		clone.updateOption('maxRetries', 2);

		let count = 0;

		await clone
			.execute(async () => {
				count += 1;

				if (count !== 3) {
					throw new Error('Test');
				}
			})
			.catch(error => {
				expect(error.message).toBe('Test');
			});
	});

	it('should be able to retry a promise', async () => {
		let count = 0;

		const value = await strategy.execute(async () => {
			count += 1;

			if (count !== 3) {
				throw new Error('Test');
			}

			return 1000;
		});

		expect(value).toBe(1000);
	});

	it('should be able to retry an observable', done => {
		let count = 0;

		const observable = of(1000).pipe(
			tap(() => {
				count += 1;

				if (count !== 3) {
					throw new Error('Test');
				}

				return 1000;
			})
		);

		strategy.execute(observable).subscribe({
			next: value => {
				expect(value).toBe(1000);
			},
			complete: () => {
				done();
			}
		});
	});
});
