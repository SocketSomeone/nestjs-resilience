import { Backoff } from './base.backoff';

export class ExponentialBackoff extends Backoff {
	public *getGenerator(maxRetries: number): Generator<number, void, number> {
		let attempt = 0;

		while (attempt < maxRetries) {
			yield this.baseDelay * 2 ** attempt;
			attempt += 1;
		}
	}
}
