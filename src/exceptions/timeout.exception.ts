import { ResilienceRuntimeException } from './resilience-runtime.exception.js';

export class TimeoutException extends ResilienceRuntimeException {
	public constructor(timeout: number) {
		super(`Operation timed out after ${timeout}ms`);
	}
}
