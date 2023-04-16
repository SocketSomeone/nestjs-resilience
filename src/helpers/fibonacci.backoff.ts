import { Backoff } from './base.backoff';

export class FibonacciBackoff extends Backoff {
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
