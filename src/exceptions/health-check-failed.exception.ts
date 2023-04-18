import { ResilienceRuntimeException } from './resilience-runtime.exception';

export class HealthCheckFailedException extends ResilienceRuntimeException {
	public constructor() {
		super('Health check failed');
	}
}
