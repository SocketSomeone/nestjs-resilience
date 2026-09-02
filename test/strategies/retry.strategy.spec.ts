import { of, tap } from 'rxjs';

import { FixedBackoff, RetryStrategy } from '../../src/index.js';

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

	it('should exceed retry limit', () => {
		const clone = strategy.clone();
		clone.updateOption('maxRetries', 2);

		return new Promise<void>(resolve => {
			clone.process(observable).subscribe({
				error: err => {
					expect(err.message).toBe('Test');
					expect(count).toBe(2);
					resolve();
				}
			});
		});
	});

	it('should be able to retry an observable', () => {
		return new Promise<void>(resolve => {
			strategy.process(observable).subscribe({
				next: value => {
					expect(value).toBe(1);
					expect(count).toBe(3);
				},
				complete: () => {
					resolve();
				}
			});
		});
	});
});
