import { ResilienceRuntimeException } from './resilience-runtime.exception';

export class ThrottlerException extends ResilienceRuntimeException {
	public constructor() {
		super(`Rate limit exceeded`);
	}
}
