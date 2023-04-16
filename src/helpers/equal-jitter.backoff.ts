import { Random } from '../utils';
import { Backoff } from './base.backoff';

export class EqualJitterBackoff extends Backoff {
	public *getGenerator(maxRetries: number): Generator<number, void, number> {
		let attempt = 0;

		while (attempt < maxRetries) {
			const exponentialDelay = this.baseDelay * 2 ** attempt;
			yield exponentialDelay / 2 + Random.Between(0, exponentialDelay / 2 + 1);
			attempt += 1;
		}
	}
}
