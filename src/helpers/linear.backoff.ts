import { Backoff } from './base.backoff';

export class LinearBackoff extends Backoff {
	public *getGenerator(maxRetries: number): Generator<number, void, number> {
		let attempt = 0;

		while (attempt < maxRetries) {
			yield this.baseDelay * attempt;
			attempt += 1;
		}
	}
}
