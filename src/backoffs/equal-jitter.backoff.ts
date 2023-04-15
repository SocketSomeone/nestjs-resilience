import { Backoff, BackoffOptions } from './backoff.interface';
import { Random } from '../utils';

export class EqualJitterBackoff implements Backoff {
	private readonly baseDelay: number;

	public constructor(options: BackoffOptions = {}) {
		this.baseDelay = options.baseDelay || 100;
	}

	public *getDelay(maxRetries: number): Generator<number, void, number> {
		let attempt = 0;

		while (attempt < maxRetries) {
			const exponentialDelay = this.baseDelay * 2 ** attempt;
			yield exponentialDelay / 2 + Random.Between(0, exponentialDelay / 2 + 1);
			attempt += 1;
		}
	}
}
