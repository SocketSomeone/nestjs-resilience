export interface BackoffOptions {
	baseDelay?: number;
}

export interface Backoff {
	getGenerator(maxRetries: number): Generator<number>;
}
