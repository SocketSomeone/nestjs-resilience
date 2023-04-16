import { Backoff } from './base.backoff';

export class DecorrelatedJitterBackoff extends Backoff {
	private static readonly RP_SCALING_FACTOR = 1 / 1.4;

	public *getGenerator(maxRetries: number): Generator<number, void, number> {
		let attempt = 0,
			previous = 0;

		while (attempt < maxRetries) {
			const t = attempt + Math.random();

			const next = Math.pow(2, t) * Math.tanh(Math.sqrt(4.0 * t));
			const formulaIntrisincValue = Math.max(0, next - previous);

			previous = next;

			yield formulaIntrisincValue *
				DecorrelatedJitterBackoff.RP_SCALING_FACTOR *
				this.baseDelay;

			attempt += 1;
		}
	}
}
