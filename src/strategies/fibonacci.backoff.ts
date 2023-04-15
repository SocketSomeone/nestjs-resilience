import { Backoff, BackoffOptions } from './backoff.interface';

export class FibonacciBackoff implements Backoff {
	private readonly baseDelay: number;

	public constructor(options: BackoffOptions = {}) {
		this.baseDelay = options.baseDelay || 100;
	}

	public *getGenerator(maxRetries: number): Generator<number, void, number> {
		let attempt = 0,
			previous = 0,
			current = 1;

		while (attempt < maxRetries) {
			const next = previous + current;
			previous = current;
			current = next;

			yield next * this.baseDelay;
			attempt += 1;
		}
	}
}
