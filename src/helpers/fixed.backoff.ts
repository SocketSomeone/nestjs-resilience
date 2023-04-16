import { Backoff } from './base.backoff';

export class FixedBackoff extends Backoff {
	public *getGenerator(maxRetries: number): Generator<number, void, number> {
		let attempt = 1;

		while (attempt < maxRetries) {
			yield this.baseDelay;
			attempt += 1;
		}
	}
}
