import { Random } from '../utils';
import { Backoff } from './base.backoff';

export class JitterBackoff extends Backoff {
	public *getGenerator(maxRetries: number): Generator<number, void, number> {
		let attempt = 0;

		while (attempt < maxRetries) {
			yield Random.Between(0, this.baseDelay * 2 ** attempt);
			attempt += 1;
		}
	}
}
