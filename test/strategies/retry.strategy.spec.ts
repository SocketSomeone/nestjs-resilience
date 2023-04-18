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

	let count = 0;

	const observable = of(1).pipe(
		tap(() => {
			count += 1;

			if (count !== 3) {
				throw new Error('Test');
			}
		})
	);

	beforeEach(() => {
		count = 0;
	});

	it('should exceed retry limit', done => {
		const clone = strategy.clone();
		clone.updateOption('maxRetries', 2);

		clone.process(observable).subscribe({
			error: err => {
				expect(err.message).toBe('Test');
				expect(count).toBe(2);
				done();
			}
		});
	});

	it('should be able to retry an observable', done => {
		strategy.process(observable).subscribe({
			next: value => {
				expect(value).toBe(1);
				expect(count).toBe(3);
			},
			complete: () => {
				done();
			}
		});
	});
});
