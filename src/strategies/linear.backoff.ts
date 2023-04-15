import { Backoff, BackoffOptions } from './backoff.interface';

export class LinearBackoff implements Backoff {
	private readonly baseDelay: number;

	public constructor(options: BackoffOptions = {}) {
		this.baseDelay = options.baseDelay || 100;
	}

	public *getGenerator(maxRetries: number): Generator<number, void, number> {
		let attempt = 0;

		while (attempt < maxRetries) {
			yield this.baseDelay * attempt;
			attempt += 1;
		}
	}
}
