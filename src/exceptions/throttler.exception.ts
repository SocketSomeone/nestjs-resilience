import { ResilienceRuntimeException } from './resilience-runtime.exception.js';

export class ThrottlerException extends ResilienceRuntimeException {
	public constructor() {
		super(`Rate limit exceeded`);
	}
}
