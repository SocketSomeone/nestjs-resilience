export interface BackoffOptions {
	baseDelay?: number;
}

export abstract class Backoff {
	protected readonly baseDelay: number;

	public constructor(options: BackoffOptions = {}) {
		this.baseDelay = options.baseDelay || 100;
	}

	public abstract getGenerator(attempt: number): Generator<number>;
}
