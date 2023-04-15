import { Backoff, BackoffOptions } from './backoff.interface';

export class ExponentialBackoff implements Backoff {
	private readonly baseDelay: number;

	public constructor(options: BackoffOptions = {}) {
		this.baseDelay = options.baseDelay || 100;
	}

	public *getDelay(maxRetries: number): Generator<number, void, number> {
		let attempt = 0;

		while (attempt < maxRetries) {
			yield this.baseDelay * 2 ** attempt;
			attempt += 1;
		}
	}
}
