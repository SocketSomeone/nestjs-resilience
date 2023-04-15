import { Backoff, BackoffOptions } from './backoff.interface';
import { Random } from '../utils';

export class JitterBackoff implements Backoff {
	private readonly baseDelay: number;

	public constructor(options: BackoffOptions = {}) {
		this.baseDelay = options.baseDelay || 100;
	}

	public *getDelay(maxRetries: number): Generator<number, void, number> {
		let attempt = 0;

		while (attempt < maxRetries) {
			yield Random.Between(0, this.baseDelay * 2 ** attempt);
			attempt += 1;
		}
	}
}
