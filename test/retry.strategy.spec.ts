import { RetryStrategy } from '../src/strategies/retry.strategy';
import { FixedBackoff } from '../src';
import { of, tap } from 'rxjs';

describe('Retry Strategy', () => {
	const strategy = new RetryStrategy({
		maxRetries: 5,
		maxDelay: 30000,
		scaleFactor: 1,
		backoff: FixedBackoff,
		retryable: () => true
	});

	it('should be able to retry a promise', done => {
		let count = 0;

		const fn = async () => {
			count += 1;
			console.log(count);

			if (count !== 3) {
				throw new Error('Test');
			}

			return 1000;
		};

		strategy.execute(fn).then(value => {
			expect(value).toBe(1000);
			done();
		});
	});

	it('should be able to retry an observable', done => {
		let count = 0;

		const observable = of(1000).pipe(
			tap(() => {
				count += 1;

				if (count !== 3) {
					throw new Error('Test');
				}
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
