import { ResilienceRuntimeException } from './resilience-runtime.exception';

export class ResilienceTimeoutException extends ResilienceRuntimeException {
	public constructor(timeout: number) {
		super(`Operation timed out after ${timeout}ms`);
	}
}
