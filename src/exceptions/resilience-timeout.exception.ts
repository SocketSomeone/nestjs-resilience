import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ResilienceTimeoutException extends RuntimeException {
	public constructor(timeout: number) {
		super(`Operation timed out after ${timeout}ms`);
	}
}
