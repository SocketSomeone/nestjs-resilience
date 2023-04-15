export interface BackoffOptions {
	baseDelay?: number;
}

export interface Backoff {
	getDelay(maxRetries: number): Generator<number, void, number>;
}
